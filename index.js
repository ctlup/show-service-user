import express from 'express'
import { authentication, getUserInfo, loginController, notFound, signUpController, requestLogger } from './controllers.mjs';
import 'dotenv/config'

const app = express()
const PORT = (+process.env.PORT) || 3000;

// const {
//     LOGIN_PATH,
//     SIGNUP_PATH,
//     USER_INFO_PATH,
// } = process.env;
const SIGNUP_PATH = '/user/'
const LOGIN_PATH = '/user/';
const USER_INFO_PATH = '/user/:id'
const USER_INFO_SELF = '/user/me'

app.use(requestLogger)
app.use(express.json())

app.post(SIGNUP_PATH, signUpController)
app.post(LOGIN_PATH, loginController)
app.get(USER_INFO_PATH, authentication, getUserInfo)

app.all("*", notFound)

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})