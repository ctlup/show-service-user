import bcrypt from 'bcrypt';
import { User } from "./models/User.mjs";
import logger from './logger.mjs';

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
    ) res.status(400).json(logAndCreateErrorObj("The user data is not completed!", req.body));
    if(!pwd_re.test(userData.pwd_raw)) {
        const msg = "Password is not enough strong: there should be minimum 8 characters, at least one letter and one number";
        res.status(400).json(logAndCreateErrorObj(msg, req.body))
    }
    if(!email_re.test(userData.email)) {
        const msg = "Email is not valid";
        res.status(400).json(logAndCreateErrorObj(msg, userData.email))
    }
    
    bcrypt.hash(userData.pwd_raw, saltRounds, async function(err, hash) {
        if(err) res.status(500).json(logAndCreateErrorObj("Internal service error", req.body))
        userData.pwd_hash = hash;
        const user = new User(userData);
        res.end();
        const result = await user.create();
        logger.info("Created new user %s", result)
        
    });
}

export async function loginController(req, res) {
    req.body = req.body || {};
    if(!req.body.email || !req.body.password) {
        const msg = "Credentials are not specified";
        res.status(400).json(logAndCreateErrorObj(msg))
        return
    }
    try {
        const user = await User.getByEmail(req.body.email);
        const isPwdValid = await bcrypt.compare(req.body.password, user.pwd_hash);
        if(isPwdValid) {
            const token = jwt.sign({user: user.id, auth_time: Date.now()}, process.env.SECRET)
            res.append('Authorization', `Bearer ${token}`)
            logger.info("User %s was successfully logged in", req.body.email)
            res.end('OK!')
        } else {
            const msg = "Credentials are not valid";
            logger.info("User %s didn't logged in. Credentials are not valid", req.body.email)
            res.status(401).json(logAndCreateErrorObj(msg))
        }

    } catch(e) {
        res.status(400).json(logAndCreateErrorObj("Login error!"), req.body)
    }

}

export async function getUserInfo(req, res) {
    if(!req.params.id) {
        const msg = "User ID is not specified.";
        res.status(400).json(logAndCreateErrorObj(msg))
    }
    try {
        const user = await User.getById(req.params.id);
        res.json(user).end();
        logger.info("User with id %s, was successfully requested", req.params.id)
    } catch(e) {
        // TODO: response the error status depending on the server side or client side issue
        res.status(400).json(logAndCreateErrorObj(e.message))
    }
}


export function requestLogger(req, res, next) {
    logger.info("%s - [%s] %s", req.protocol, req.method, req.originalUrl);
    next();
}

export function notFound(req, res) {
    logger.info('Unknown path %s', req.originalUrl)
    res.status(404).end("Unknown Path")
}

function logAndCreateErrorObj(msg, req) {
    
    logger.error(msg);

    return { 
        message: `ERROR: ${msg}`,
        request: req
    };
}

