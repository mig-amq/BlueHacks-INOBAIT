module.exports = (function () {
  'use strict';

  const express = require('express')
  const routes = express.Router()
  const firestore = require("../data/firestore")

  routes.get('/', (req, res) => {
    res.send({})
  })

  // Returns list of all users
  routes.get('/users', (req, res) => {
    firestore
      .collection('users')
      .get()
      .then(snapshot => {
        let users = []
        snapshot.forEach(doc => users.push(doc.data()))
        res.send(users)
      })
      .catch(err => res.send([]))
  })

  // Logs user out
  routes.get('/users/logout', (req, res) => {
    res.clearCookie('user')
    res.render('index')
  })

  // Complete information
  routes.get('/users/complete_information', (req, res) => {
    let end = new Date(Date.now())
    end.setMonth(end.getMonth() + 1)
    
    let user = req.cookies['user']
    
    user.pickup = req.query.pickup
    user.contact = req.query.contact
    user.lunch_time = req.query.lunch_time
    user.subscription = {
      region: req.query.region,
      start: new Date(Date.now()),
      end: end
    }
    firestore
      .collection('users')
      .add(user)
      .then(ref => {
        user.id = ref.id
        res.cookie("user", user)
        res.send(user)
      })
  })

  routes.get('/users/change_pickup', (req, res) => {
    let user = req.cookies["user"]
    
    firestore
      .collection("users")
      .doc(user.id)
      .update({
        pickup: req.query.pickup
      })
      .then(() => {
        user.pickup = req.query.pickup
        res.cookie('user', user)
        res.send(user)
      })
  })
  
  routes.get('/users/resubscribe', (req, res) => {
    let end = new Date(Date.now())
    end.setMonth(end.getMonth() + 1)
    let subscription = {
      start: new Date(Date.now()),
      end: end,
      region: req.query.region
    }
    firestore
      .collection('users')
      .doc(req.cookies['user'].id)
      .update(subscription)
      .then(() => {
        let user = req.cookies['user']
        user.subscription = subscription
        res.cookie('user', user)
        res.send(user)
      })
  })

  // Logs user in
  routes.get('/users/login', (req, res) => {
    firestore
      .collection('users')
      .where("email", "==", req.query.zu)
      .get()
      .then(snapshot => {
        let nosub = false;
        if (snapshot.empty) {
          nosub = true;
        }
        
        let data = {}
        if (nosub) {
          data = {
            name: req.query.Ad,
            email: req.query.zu,
            image_link: req.query.Uk,
            contact: null,
            lunch_time: null,
            subscription: null
          }

          res.cookie("user", data)
          res.render("complete_information", {'user': data})
        } else {
          snapshot.forEach(doc => {
            data = {
              id: doc.id,
              name: req.query.Ad,
              email: req.query.zu,
              image_link: req.query.Uk,
              contact: doc.data().contact,
              lunch_time: doc.data().lunch_time,
              subscription: doc.data().subscription
            }

            res.cookie("user", data)
            res.render("index", {'user': data})
          })
        }
        
      })
      .catch(err => console.error(err))
  })

  // Returns details of a user
  routes.get('/users/:userID', (req, res) => {
    firestore
      .collection('users')
      .doc(req.params.userID)
      .get()
      .then(snapshot => {
        if (!snapshot.exists)
          res.send({})
        else
          res.send(doc.data())
      })
      .catch(err => res.send({}))
  })

  // Returns regional dishes
  routes.get('/regions/:regionID/dishes', (req, res) => {
    firestore
      .collection('regions')
      .doc(req.params.regionID)
      .get()
      .then(snapshot => {
        if (!snapshot.exists)
          res.send([])
        else
          res.send(snapshot.data().cuisine)
      })
      .catch(err => res.send([]))
  })

  // Returns regions
  routes.get("/regions", (req, res) => {
    firestore
    .collection('regions')
    .get()
    .then(snapshot => {
      if (snapshot.empty)
        res.send([])
      
      let data = []
      snapshot.forEach(doc => data.push(doc.data()))
      res.send(data)
    })
    .catch(err => res.send([]))
  })

  // Returns QR Text
  routes.get('/qr/:qrID', (req, res) => {

  })

  return routes;
});