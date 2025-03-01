import viewsRouter from "./routes/viewsRoutes.js"
import productsRouter from "./routes/productsRoutes.js"
import cartsRouter from "./routes/cartsRoutes.js"
import userRouter from "./routes/usersRoutes.js"

import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from "passport"
import initializePassport from "./config/passport-config.js"
import cors from 'cors'
// import { engine } from "express-handlebars"
import hbs from "./utils/helpersHBS.js"

import populateDB from "./utils/populateDB.js"
import __dirname from "./path.js"


const app = express()
const PORT = 8080

// app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(session({
    //ttl Time to Live tiempo de vida (segundos)
    //retries: Cantidad de veces que el servidor va a intentar leer ese archivo
    //store: new fileStorage({path: './src/sessions', ttl: 10, retries: 1 }),
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://lea21luna:<'MongoURLpass'>@cluster0.f1eza.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        mongoOptions: {},
        ttl: 10800
    }),
    secret: 'SessionSecret',
    resave: true,
    saveUninitialized: true
}))

app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")
app.set("views", __dirname + "\\views")
app.use(express.static(__dirname + '\\public'))

mongoose.connect("mongodb+srv://lea21luna:<'MongoURLpass'>@cluster0.f1eza.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("DB is ONLINE...!!!"))
.catch((e) => console.log("Error al conectarme a DB:", e))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/", viewsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/users", userRouter)

app.listen(PORT, () => {
    console.log(`SERVER UP...!!! Port: ${PORT}`)
})

// llenamos la bd con productos para probar paginacion
// populateDB("mongodb+srv://@cluster0.f1eza.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", "test")
