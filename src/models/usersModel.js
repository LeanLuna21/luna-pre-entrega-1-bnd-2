import { Schema, model } from "mongoose";
import cartModel from "./cartsModel.js";

const userSchema = new Schema(
    {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number
        },
        img: {
            type: String,
            default: "Sin imagen"
        },
        age: {
            type: Number,
        },
        address: {
            type: String,
        },
        fechaAlta: {
            type: Date,
            default: Date.now()
        },
        role: {
            type: String,
            default: "user"
        },
        cart: {
            type: Schema.Types.ObjectId,
            ref: "carts"
        }
    },
    {
        timestamps: true,
        // strict: true
    }
)

userSchema.post("save", async function (user) {
    try {
        if(!user.cart) {
            let newCart = await cartModel.create({products: []})
            await model("users").findByIdAndUpdate(user._id, { cart: newCart._id })
        }
    } catch(e) {
        console.log(e.message);
    }
})

const userModel = model("users", userSchema);

export default userModel