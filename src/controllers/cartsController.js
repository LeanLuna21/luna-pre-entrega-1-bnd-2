import cartModel from "../models/cartsModel.js";
import itemModel from "../models/productsModel.js";
import { isValidObjectId } from 'mongoose';

// list all carts
export const getCarts = async (req, res) => {
    try {
        let carts = await cartModel.find()
            .populate({ path: "products.product" })
            .lean()
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json(carts)
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}

// list one cart (search by ID)
export const getCartById = async (req, res) => {
    let cartId = req.params.cid
    if (!isValidObjectId(cartId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).send({ error: `Invalid Cart ID!` })
    }
    try {
        let cart = await cartModel.findById(cartId)
            .populate({ path: "products.product" })
            .lean()
        if (!cart) {
            return res.status(404).send({ error: `cart of id ${cartId} NOT FOUND.` })
        }
        return res.status(200).json(cart)
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}

// create cart
export const createCart = async (req, res) => {
    try {
        let orders = []
        let cart = { products: orders }
        let newCart = await cartModel.create(cart)
        return res.status(201).send({ CONFIRMATION: "CART Created.", new_cart: newCart })
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${err.message}` })
    }
}

export const addOrderToCart = async (req, res) => {
    let cartId = req.params.cid
    let itemId = req.params.pid

    if (!isValidObjectId(cartId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Cart ID!` })
    }
    if (!isValidObjectId(itemId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }

    try {
        // let { quantity } = req.body
        let cart = await cartModel.findById(cartId)
        if (!cart) {
            return res.status(404).send({ ERROR: `cart id ${cid} NOT FOUND.` })
        }
        let product = await itemModel.findById(itemId)
        if (!product) {
            return res.status(404).send({ ERROR: `product id ${pid} NOT FOUND.` })
        }

        if (cart.products.find(prod => prod.product.equals(product._id))) {
            cart.products.forEach(prod => {
                if (prod.product.equals(product._id)) {
                    ++prod.quantity
                }
            })
        }
        else {
            cart.products.push(
                {
                    product: product._id,
                    quantity:  1
                }
            )
        }

        let modifiedCart = await cartModel.findOneAndUpdate({ _id: cartId }, cart, { new: true })
        return res.status(200).send({ CONFIRMATION: "Order Saved.", updated_cart: modifiedCart })
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}

export const updateCartOrder = async (req, res) => {
    let cartId = req.params.cid
    let itemId = req.params.pid

    if (!isValidObjectId(cartId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Cart ID!` })
    }
    if (!isValidObjectId(itemId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }

    try {
        let cart = await cartModel.findById(cartId)
        if (!cart) {
            return res.status(404).send({ ERROR: `cart id ${cartId} NOT FOUND.` })
        }

        let prodIndex = cart.products.findIndex(prod => prod.product.equals(itemId))
        if (prodIndex === -1){
            return res.status(404).send({ ERROR: `product of id ${itemId} NOT FOUND in cart.` })
        }

        let prodInCart = cart.products[prodIndex]

        let producto = await itemModel.findById(itemId)

        let { quantity } = req.body
        quantity = Number(quantity)
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "Invalid quantity value." });
        }
        
        if (quantity > producto.stock) {
            return res.status(400).json({
                error: `Requested quantity (${quantity}) exceeds available stock (${producto.stock}).`
            });
        }

        prodInCart.quantity = quantity

        // $set -> operador para  reemplazar el valor de un campo con el valor especificado 
        let modifiedCart = await cartModel.findByIdAndUpdate(cartId, { $set: { products: cart.products } }, { new: true })
        return res.status(200).send({ CONFIRMATION: "Order Modified.", updated_cart: modifiedCart })

    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}

export const emptyCart = async (req, res) => {
    let cartId = req.params.cid
    if (!isValidObjectId(cartId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).send({ error: `Invalid Cart ID!` })
    }
    try {
        let cart = await cartModel.findById(cartId)
        if (!cart) {
            return res.status(404).send({ ERROR: `cart id ${cartId} NOT FOUND.` })
        }
        if (cart.products.length === 0){
            return res.status(404).send({ ERROR: `cart id ${cartId} IS EMPTY.` })
        }
        await cartModel.findByIdAndUpdate(cartId, {$set: { products: [] }}, { new: true })
        return res.status(200).send({ CONFIRMATION: `Cart ${cartId} is now empty.`})
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}

export const removeOrder = async (req, res) => {
    let cartId = req.params.cid
    let itemId = req.params.pid

    if (!isValidObjectId(cartId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Cart ID!` })
    }
    if (!isValidObjectId(itemId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }

    try {
        let cart = await cartModel.findById(cartId)
        let prodIndex = cart.products.findIndex(p => p.product.equals(itemId))
        if (prodIndex === -1) {
            return res.status(404).json({ error: `Product ${itemId} not found in cart` })
        }
        cart.products.splice(prodIndex, 1)

        await cartModel.findByIdAndUpdate(cartId, { $set: { products: cart.products } }, { new: true })
        return res.status(200).send({ CONFIRMATION: "Product Removed." })

    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}