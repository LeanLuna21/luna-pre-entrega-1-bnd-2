import { Router } from "express";
import { getCarts, getCartById, createCart, addOrderToCart, updateCartOrder, emptyCart, removeOrder, checkout} from "../controllers/cartsController.js";
import { authorization } from "../config/middlewares.js";

const cartsRouter = Router()

cartsRouter.get("/", getCarts)
cartsRouter.get("/:cid", getCartById)
cartsRouter.post("/", authorization("user"), createCart)
cartsRouter.post("/:cid/product/:pid", authorization("user"), addOrderToCart)
cartsRouter.put("/:cid/product/:pid", authorization("user"), updateCartOrder)
cartsRouter.delete("/:cid", authorization("user"), emptyCart)
cartsRouter.delete("/:cid/product/:pid", authorization("user"), removeOrder)

// user cart checkout
cartsRouter.post('/:cid/checkout', checkout)


export default cartsRouter