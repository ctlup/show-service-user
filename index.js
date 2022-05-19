import express from 'express'
import { authentication, getUserInfo, loginController, signUpController } from './controllers';
import 'dotenv/config'

const app = express()
const PORT = (+process.env.PORT) || 3000;

// const {
//     LOGIN_PATH,
//     SIGNUP_PATH,
//     USER_INFO_PATH,
// } = process.env;
SIGNUP_PATH = '/user/'
LOGIN_PATH = '/user/';
USER_INFO_PATH = '/user/:id'
USER_INFO_SELF = '/user/me'

app.use(loginController)
app.use(express.json())

app.post(SIGNUP_PATH, signUpController)
app.post(LOGIN_PATH, loginController)
app.get(USER_INFO_PATH, authentication, getUserInfo)

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})