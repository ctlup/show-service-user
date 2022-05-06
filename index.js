import express from 'express'
const app = express()
const port = (+process.env.PORT) || 3000;

const {
    LOGIN_PATH,
    SIGNUP_PATH,
    USER_INFO_PATH,
} = process.env;
app.use(express.json())
app.get(SIGNUP_PATH, (req, res) => {

})
app.get(LOGIN_PATH, (req, res) => {
  
})

app.listen(port, () => {
  console.log(`Server started on port: ${port}`)
})