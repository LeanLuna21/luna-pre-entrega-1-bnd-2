import itemModel from "../models/productsModel.js";
import { isValidObjectId } from 'mongoose';

// list items
export const getItems = async (req, res) => {
    try {
        let productos = await itemModel.find()
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json(productos)
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}

// list one item (search by ID)
export const getItemById = async (req, res) => {
    let itemId = req.params.pid

    if (!isValidObjectId(itemId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).send({ error: `Invalid Product ID!` })
    }
    try {
        let producto = await itemModel.findById(itemId)
        if (!producto) {
            return res.status(404).send({ error: `product of id ${itemId} NOT FOUND.` })
        }
        return res.status(200).json(producto)
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}

// add new product
export const createItem = async (req, res) => {
    let {code, title, type, category, description, img, price, stock} = req.body
    // Validar que ninguno de los campos escenciales vacio
    if (!code || !title || !type || !category || !price || !stock) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: "Faltan campos obligatorios." })
    }
    try {
        let existe = await itemModel.findOne({code:code}) //returns prod or null
        if (existe) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya existe un producto con codigo ${code}` })
        }
        let newProduct = {code, title, type, category, description, img, price, stock}
        let productAdded = await itemModel.create(newProduct)
        // req.io.emit("newProduct", productAdded)
        return res.status(201).json({message:"Product Added", new_product:productAdded})
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${err.message}` })
    }
}

// update product data
export const updateItem = async (req, res) => {
    let itemId = req.params.pid
    if (!isValidObjectId(itemId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    let fields = req.body
    try {
        let product_u = await itemModel.findByIdAndUpdate(itemId, fields, {new:true})
        return res.status(200).json({ CONFIRMATION: `Product ${itemId} updated!`, updated_product:product_u })
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${err.message}` })
    }
}

// delete product
export const deleteItem = async (req, res) => {
    let itemId = req.params.pid
    if (!isValidObjectId(itemId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    try {
        let product = await itemModel.findByIdAndDelete(itemId)
        if (!product) {
            return res.status(404).send({ ERROR: `product of id ${itemId} NOT FOUND.` })
        }
        // req.io.emit("deleteProduct", product)
        return res.status(200).json({ CONFIRMATION: "Product deleted!", deleted_product:product })

    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${err.message}` })
    }
}