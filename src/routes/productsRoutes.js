import { Router } from "express";
import { getItems, getItemById, createItem, updateItem, deleteItem } from "../controllers/productsController.js";
// import { viewProductsList } from "../controllers/viewsController.js";

const productsRouter = Router()

productsRouter.get("/", getItems)
productsRouter.get("/:pid", getItemById)
productsRouter.post("/", createItem)
productsRouter.put("/:pid", updateItem)
productsRouter.delete("/:pid", deleteItem)

export default productsRouter