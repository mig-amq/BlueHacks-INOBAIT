const path = require('path')
const express = require("express")
const cookie_parser = require("cookie-parser")
const body_parser = require("body-parser")
const hbs = require("express-handlebars")

const app = express()
const port = process.env.PORT || 3000
const firestore = require('./data/firestore')

app.use(cookie_parser("blue_hacks",  {
  maxAge: 1000 * 60 * 15,
  httpOnly: true,
  signed: true
}))
app.use(express.static('public'))
app.use(body_parser.urlencoded({ extended: true }))
app.set('view engine', 'hbs')
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}))

app.get('/', (req, res) => {
  if (req.cookies["user"]) {
    firestore
      .collection("users")
      .where("email", "==", req.cookies["user"].email)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          snapshot.forEach((doc) => {
            req.cookie("user", doc.data())
          })
        }
      })
  }

  if (req.cookies["user"] && req.cookies["user"].subscription && req.cookies["user"].subscription.start && req.cookies["user"].subscription.end) {
    res.render('home', {user: req.cookies['user'], template: 'home', layout: 'home'})
  } else if (req.cookies["user"]) {
    res.render("complete_information", {user: req.cookies['user'], layout: 'complete_information', template: 'complete'})
  } else 
    res.render("index", {user: req.cookies['user'], template: 'landing'})
})

app.get('/select_region/:regionID', (req, res) => {
  if (req.cookies["user"]) {
    firestore
      .collection("users")
      .where("email", "==", req.cookies["user"].email)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          snapshot.forEach((doc) => {
            req.cookie("user", doc.data())
          })
        }
      })
  }

  if (req.cookies["user"] && req.cookies["user"].subscription && req.cookies["user"].subscription.start && req.cookies["user"].subscription.end) {
    res.render('home', {user: req.cookies['user'], template: 'home', layout: 'home'})
  } else
  res.render("select_region", {user: req.cookies['user'], template: 'region', id: req.params.regionID})
})

app.get("/paypal", (req, res) => {
  if (req.cookies["user"]) {
    firestore
      .collection("users")
      .where("email", "==", req.cookies["user"].email)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          snapshot.forEach((doc) => {
            req.cookie("user", doc.data())
          })
        }
      })
  }
  
  if (req.cookies["user"] && req.cookies["user"].subscription && req.cookies["user"].subscription.start && req.cookies["user"].subscription.end) {
    res.render('home', {user: req.cookies['user'], template: 'home', layout: 'home'})
  } else
  res.render("paypal", {user: req.cookies['user'], template: 'landing'});
})


app.use('/api', require('./routes/api')())
app.listen(port, () => console.log("Listening at port: " + port + "..."))