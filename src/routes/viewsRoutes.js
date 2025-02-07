import { Router } from "express";
//importar funciones del controlador
import { githubLogin, NewProduct, updateProduct, userCreate, userLogin, viewIndex, viewLogin, viewLogOut, viewNewProduct, viewProductEdit, viewProfile, viewSignUp } from "../controllers/viewsController.js";
import passport from "passport";
import { authorization } from "../config/middlewares.js";

const viewsRouter = Router()

viewsRouter.get('/', viewIndex)
viewsRouter.get('/profile', viewProfile)
viewsRouter.get('/login', viewLogin)
viewsRouter.get('/register', viewSignUp)
viewsRouter.get('/logout', viewLogOut)

viewsRouter.post('/login', passport.authenticate('login'), userLogin)
viewsRouter.post('/register', passport.authenticate('register'), userCreate)

viewsRouter.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res) => {})
viewsRouter.get('/api/sessions/githubcallback', passport.authenticate('github', {failureRedirect:'login'}), githubLogin)
viewsRouter.get('/current', passport.authenticate('jwt'), authorization("user"), async (req, res) => res.send(req.user))

// admin product manager
viewsRouter.get('/edit-product/:pid', authorization("admin"), viewProductEdit)
viewsRouter.post('/edit-product/:pid', authorization("admin"), updateProduct) 
viewsRouter.get('/add-product/', authorization("admin"), viewNewProduct)
viewsRouter.post('/add-product/', authorization("admin"), NewProduct) 

export default viewsRouter 