export const authorization = (rol) => {
    return async(req, res, next) => {
        if(!req.user) return res.status(500).render("templates/server-error", { error:"No autenticado"})
        console.log(req.user.role);
        console.log(rol);
        if(req.user.role != rol) return res.status(500).render("templates/server-error", { error:"No autorizado"})
        next()
    }
}