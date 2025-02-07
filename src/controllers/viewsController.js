import { isValidObjectId } from "mongoose";
import { generateToken } from "../utils/jwt.js"
import userModel from "../models/usersModel.js";
import itemModel from "../models/productsModel.js";


export const userLogin = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).render('templates/login', { error: "Usuario o contraseña incorrectos." })
        }
        const token = generateToken(req.user)
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            role: req.user.role
        }

        res.cookie('coderCookie', token, {
            httpOnly: true,
            secure: false, //Evitar errores por https
            maxAge: 3600000 //Una hora
        })
        return res.status(200).redirect('/')

    } catch (err) {
        console.log(err);
        return res.status(500).render("templates/server-error", { error: "Error al loguearse" })
    }
}

export const userCreate = async (req, res) => {
    try {
        console.log(req.user)
        if (!req.user) {
            return res.status(400).render('templates/register', { error: `Este email ya se encuentra en uso.` })
        } else {
            return res.status(201).render('templates/login', { message: "User Created Successfully!" })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).render("templates/server-error", { error: "Error al registrarse." })
    }

}

export const githubLogin = (req, res) => {
    try {
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }
        res.status(200).redirect("/")
    } catch (err) {
        console.log(err);
        return res.status(500).render("templates/server-error", { error:"Error al loguear usuario"})
    }
}

export const viewLogOut = (req, res) => {
    req.session.destroy((e) => {
        if (e) {
            console.log(e)
            res.status(500)
        } else {
            return res.status(200).render("templates/index", { message: "Sesión finalizada" })
        }
    })
}

export const viewIndex = async (req, res) => {
    try {

        // console.log(req);
        // console.log(req.session);
        
        let loggedUser = req.session.user
        // console.log("user: ", loggedUser);
        let isAdmin 
        if (req.session.user?.role){
            isAdmin = req.session.user.role === "admin" 
        }
        // console.log("admin: ", isAdmin);
        // console.log("-------------------------");

        let { page, limit, filter } = req.query
        const pag = page !== undefined ? page : 1
        const limite = limit !== undefined ? limit : 4
        const filtro = {}

        if (filter) {
            filtro.category = { $regex: filter, $options: "i" } // Case-insensitive regex for category
        }

        let menuItems = await itemModel.paginate(filtro, { page: pag, limit: limite, lean: true })
        // let comidas = menuItems.docs.filter(item => item.type = "comidas")
        // let bebidas = menuItems.docs.filter(item => item.type = "bebidas")

        let categories = []
        let items = await itemModel.find()
        items.forEach(item => {
            if (item.category && !categories.includes(item.category)) {
                categories.push(item.category);
            }
        })

        menuItems.pageNumbers = Array.from({ length: menuItems.totalPages }, (_, i) => ({
            number: i + 1,
            isCurrent: i + 1 === menuItems.page,
            limit: menuItems.limit
        }))

        //  menuItems.pageNumbers = [{number:pag, isCurrent:true}]

        return res.status(200).render("templates/index", { menuItems, categories, admin:isAdmin, user: loggedUser })
    } catch (err) {
        return res.status(500).render('templates/server-error', { error: err.message })
    }


}

export const viewLogin = (req, res) => {
    res.status(200).render("templates/login")
}

export const viewSignUp = (req, res) => {
    res.status(200).render("templates/register")
}


export const viewProfile = (req, res) => {
    return res.status(200).render("templates/profile")
}

// admin manage products views
export const viewNewProduct = async (req, res) => {
    try {
        return res.status(200).render("templates/new-product")
    } catch (error) {
        return res.status(400).render("templates/server-error", { error: err.message })
    }     
} 

export const NewProduct = async (req, res) => {
    let {code, title, type, category, description, img, price, stock} = req.body
    // Validar que ninguno de los campos escenciales vacio
    if (!code || !title || !type || !category || !price || !stock) {
        return res.status(400).render("templates/server-error", { error: "Faltan campos obligatorios" })
    }
    try {
        let existe = await itemModel.findOne({code:code}) //returns prod or null
        if (existe) {
            return res.status(400).render("templates/server-error", { error: `Ya existe un producto con codigo ${code}` })
        }
        let newProduct = {code, title, type, category, description, img, price, stock}
        let productAdded = await itemModel.create(newProduct)
        return res.status(201).render("templates/index", { message : "Product added successfully. "})
    } catch (err) {
        return res.status(500).render("templates/server-error", { error: err.message })
    }
} 

export const viewProductEdit = async (req, res) => {
    try {
        let itemID = req.params.pid
        if (!isValidObjectId(itemID)) {
            return res.status(400).render("templates/server-error", { error: `Invalid Product ID!` })
        }
        let aEditar = await itemModel.findById(itemID).lean()
        return res.status(200).render("templates/edit-product", { producto: aEditar })
    } catch (error) {
        return res.status(400).render("templates/server-error", { error: err.message })
    }
}

export const updateProduct = async (req, res) => {
    try {
        let { pid } = req.params
        let fields = req.body
        let u_prod = await itemModel.findByIdAndUpdate(pid, fields, { new: true })
        if (u_prod) {
            return res.status(200).redirect("/")
        } else {
            return res.status(404).render("templates/server-error", { error: "Product not found" })
        }
    } catch (error) {
        return res.status(500).render("templates/server-error", { error: err.message })
    }
}

export const deleteProduct = async (req, res) => {
        try {
            let { pid } = req.params
            let del_prod = await itemModel.findByIdAndDelete(pid)
            if (del_prod) {
                return res.status(200).redirect("/", del_prod)
            }
            else {
                return res.status(404).render("templates/server-error", { error: "Product not found" })
            }
        } catch (error) {
            return res.status(500).render("templates/server-error", { error: err.message })
        }
}