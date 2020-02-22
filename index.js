const express = require("express")
const cookie_parser = require("cookie-parser")
const body_parser = require("body-parser")
const hbs = require("express-handlebars")

const app = express()
const port = 3000

app.use(cookie_parser())
app.use(body_parser.urlencoded({ extended: false }))
app.set('view engine', 'hbs')
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: __dirname + 'views/layouts',
  partialsDir: __dirname + 'views/partials'
}))

app.get('/')
app.listen(port, () => console.log("Listening at port: " + port + "..."))