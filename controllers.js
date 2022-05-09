import bcrypt from 'bcrypt'
import { User } from "./models/User"

const pwd_re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const email_re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function authentication(req, res, next) {
    jwt_field = req.get("Authorization")
    if(!jwt_field) {
        res.status(401).end("No token attached to the request.")
        return
    }
    next()
}

export function signUpController(req, res) {
    const userData = req.body || {}
    if(
        !userData.name || 
        !userData.surname || 
        !userData.email || 
        !userData.phone || 
        !userData.pwd_raw
    ) res.status(400).json(requestErrorMessage("The user data is not completed!", req.body));
    if(!pwd_re.test(userData.pwd_raw)) {
        const msg = "Password is not enough strong: there should be at minimum 8 characters, at least one letter and one number";
        res.status(400).json(requestErrorMessage(msg, req.body))
    }
    if(!email_re.test(userData.email)) {
        const msg = "Email is not valid";
        res.status(400).json(requestErrorMessage(msg, userData.email))
    }
    
    bcrypt.hash(userData.pwd_raw, saltRounds, function(err, hash) {
        if(err) res.status(500).json(requestErrorMessage("Internal service error", req.body))
        userData.pwd_hash = hash;
        const user = new User(userData);
        res.end();
        user.create();
        
    });
}

export function loginController(req, res) {
    if(!req.body.email || !req.body.password) {
        const msg = "Credentials are not specified";
        res.status(400).json(requestErrorMessage(msg))
    }
    try {
        const user = await User.getByEmail(req.body.email);
        const isPwdValid = await bcrypt.compare(req.body.password, user.pwd_hash);
        if(isPwdValid) {
            const token = jwt.sign({user: user.id}, process.env.SECRET)
            res.append('Authorization', `Bearer ${token}`)
            res.end('OK!')
        } else {
            const msg = "Credentials are not valid";
            res.status(401).json(requestErrorMessage(msg))
        }

    } catch(e) {
        res.status(400).json(requestErrorMessage("Login error!"), req.body)
    }

}

export function getUserInfo(req, res) {
    if(!req.params.id) {
        const msg = "User ID is not specified.";
        res.status(400).json(requestErrorMessage(msg))
    }
    try {
        const user = await User.get(req.params.id);
        res.json(user).end();
    } catch(e) {
        // TODO: response the error status depending on the server side or client side issue
        res.status(400).json(requestErrorMessage(e.message))
    }
}


function requestErrorMessage(msg, req) {
    return { 
        message: `ERROR: ${msg}`,
        request: req
    };
}