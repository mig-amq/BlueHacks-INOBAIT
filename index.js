const path = require('path')
const express = require("express")
const cookie_parser = require("cookie-parser")
const body_parser = require("body-parser")
const hbs = require("express-handlebars")

const app = express()
const port = 3000

app.use(cookie_parser("blue_hacks",  {
  maxAge: 1000 * 60 * 15,
  httpOnly: true,
  signed: true
}))
app.use(body_parser.urlencoded({ extended: false }))
app.set('view engine', 'hbs')
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}))

app.get('/', (req, res) => {
  res.render("index")
})

app.use('/api', require('./routes/api')())
app.listen(port, () => console.log("Listening at port: " + port + "..."))