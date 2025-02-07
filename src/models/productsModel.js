import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const itemSchema = new Schema(
    {
        code:{
            type: String,
            unique: true
        },
        title: {
            type: String,
            required: [true, "Menu item name is required"]
        },
        type: {
            type: String,
            required: [true, "Menu item category is required"],
            index: true
        },
        category: {
            type: String,
            required: [true, "Menu item category is required"],
            index: true
        },
        description: {
            type: String,
        },
        img: {
            type: String,
            default: "Sin imagen"
        },
        price:{
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        status: {
            type: Boolean,
            default: true    
        },
        fechaAlta: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: true,
        // strict: true
    }
)

itemSchema.plugin(paginate)

const itemModel = model("menuItems", itemSchema)

export default itemModel