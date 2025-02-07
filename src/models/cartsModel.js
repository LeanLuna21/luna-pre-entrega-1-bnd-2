import { Schema, model } from 'mongoose'

const cartSchema = new Schema(
    {
        products: {
            type: [
                {
                    product: {
                        type: Schema.Types.ObjectId,
                        ref: "menuItems",
                        require: true
                    },
                    quantity: Number
                }
            ],
            default:[]
        }
    },
    {
        timestamps: true,
        strictPopulate: false
    })

cartSchema.pre("findOne", function () {
    this.populate("products.product")
})

const cartModel = model("carts", cartSchema);

export default cartModel