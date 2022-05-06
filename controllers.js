export function authentication(req, res, next) {
    jwt_field = req.get("Authorization")
    if(!jwt_field) {
        res.status(401).end("No token attached to the request.")
        return
    }
    next()
}

export function loginController(req, res) {

}

