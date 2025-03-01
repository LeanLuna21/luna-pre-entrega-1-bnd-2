import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt"
import userModel from "../models/usersModel.js";
import { createHash, validatePassword } from "../utils/bcrypt.js"

const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = (req) =>{
    let token = null
    if(req && req.cookies) {
        token = req.cookies['coderCookie'] //COnsulto solamente por las cookies con este nombre
        console.log(req.cookies);
    }
    
    return token
}

//Middleware para errores de passport
export const passportCall = (strategy) => {
    return async(req,res,next) => {
        
        passport.authenticate(strategy, function(err,user, info) {
            if(err) return next(err)
            
            if(!user) {
                return res.status(401).send({error: info.messages?info.messages: info.toString()})
            }
            req.user = user
            next()
        } (req,res,next))
    }
}

const initializePassport = () => {
    passport.use("login", new localStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            let user = await userModel.findOne({ email: username })

            if (user && (validatePassword(password, user.password) || (password === user.password))) {
                return done(null, user)
            }
            return done(null, false)
            
        } catch (err) {
            console.log(err.message);
            return done(err.message)
        }
    }
    )),
    
    passport.use("register", new localStrategy(
        { passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
            try {
                
                let { first_name, last_name, email, phone, age, address, password } = req.body
                
                let existe = await userModel.findOne({ email: email })
               
                if (!existe) {
                    let user = await userModel.create({
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        phone: phone,
                        age: age,
                        address: address,
                        password: createHash(password)
                    })
                    return done(null, user)
                } else {
                    return done(null, false)
                }

            } catch (err) {
                console.log(err.message);
                return done(err.message)
            }
        }
    )),

    passport.use('github', new GithubStrategy({
            clientID: "Iv23lit4aJXwoJNZUnas",  //app "1122855",
            clientSecret: 'githubSECRET',
            callbackURL: "http://localhost:8080/api/sessions/githubcallback"
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({email: profile._json.email}) 
                // console.log(profile); //esto muestra las propiedades que trae de github
                if(!user) {
                    const user = await userModel.create({
                        first_name : profile._json.name,
                        last_name : " ", //Dato no proporcionado por github 
                        email: profile._json.email, 
                        password: '1234', //Dato no proporcionado, generar pass por defecto
                        age: 18, //Dato no proporcionado por gitbub
                        img: profile._json.avatar_url
                    })
                    done(null, user)
                } else {
                    //Se loguea correctamente con el mismo mail (no lo vuelvo a registrar)
                    done(null, user)
                }
            }catch (err) {
                console.log(err.message);
                return done(err.message)
            }
    })),

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "codercoder",
    }, async (jwt_payload, done) => {
        try {
            console.log(jwt_payload);
            
            return done(null, jwt_payload.user)
        }catch (err) {
            console.log(err.message);
            return done(err.message)
        }
    })),

    passport.serializeUser((user, done) => {
        done(null, user._id)
    }),

    passport.deserializeUser (async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport