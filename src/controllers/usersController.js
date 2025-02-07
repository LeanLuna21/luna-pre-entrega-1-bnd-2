import userModel from "../models/usersModel.js";
import { isValidObjectId } from 'mongoose';

// Consultar todos los usuarios
export const getUsers = async (req,res) => {
    try {
        const users = await userModel.find()
        return res.status(200).send(users)
    } catch(err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}

// Consultar un usuario por ID
export const getUser = async (req,res) => {
    let userID = req.params.uid
    if (!isValidObjectId(userID)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).send({ error: `Invalid User ID!` })
    }
    try {
        let user = await userModel.findById(userID)
        if(user)
            res.status(200).send(user)
        else 
        return res.status(4004).send({ error: `User NOT FOUND!` })
    } catch(err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}

//Crear un usuario 
export const createUser = async (req,res) => {
    try {
        let {first_name, last_name, email, phone, img, age, address, password, role} = req.body 
        let existe = await userModel.findOne({email:email}) //returns user or null
        if (existe) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `User email already in use` })
        }
        let newUser = await userModel.create({first_name, last_name, email, phone, img, age, address, password, role})
        return res.status(201).json({message:"User Created Successfully", user:newUser})
    } catch(err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}

// Actualizar un usuario dado su ID
export const updateUser = async (req,res) => {
    let userID = req.params.uid
    if (!isValidObjectId(userID)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).send({ error: `Invalid User ID!` })
    }
    try {
        let {first_name, last_name, email, age, phone, img, address, password, role} = req.body
        let user = await userModel.findByIdAndUpdate(userID, {first_name, last_name, email, age, phone, img, address, password, role}, {new:true})
        if(user)
            return res.status(200).json({ CONFIRMATION: `User ${userID} updated!`, updated_user:user})
        else 
            return res.status(404).send({ error: `User NOT FOUND!` })
    } catch(err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}

// Eliminar un usuario dado su ID
export const deleteUser = async (req,res) => {
    let userID = req.params.uid
    if (!isValidObjectId(userID)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).send({ error: `Invalid User ID!` })
    }
    try {
        let user = await userModel.findByIdAndDelete(userID)
        if(user)
            return res.status(200).json({ CONFIRMATION: "User deleted!", deleted_user:user })
        else 
            return res.status(404).send({ error: `User NOT FOUND!` })
    } catch(err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({ error: `${err.message}` })
    }
}