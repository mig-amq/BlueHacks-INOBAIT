module.exports = (function () {
  'use strict';

  const express = require('express')
  const routes = express.Router()
  const firestore = require("../data/firestore")
  const paypal = require('../data/paypal')
  const request = require('request');

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

  // Complete partial information
  routes.get('/users/complete_information/partial', (req, res) => {
    let user = req.cookies['user']
    
    user.pickup = req.query.pickup
    user.contact = req.query.contact
    user.lunch_time = req.query.lunchtime

    console.log(req.query)
    res.cookie('user', user)
    res.send({})
  })

  // Complete partial information 2
  routes.get('/users/complete_information/partial_2', (req, res) => {
    let user = req.cookies['user']
    
    user.subscription = {
      start: null,
      end: null,
      region: req.query.id
    }

    res.cookie('user', user)

    res.send({})
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

  routes.post('/paypal/pay/execute', (req, res) => {
    const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
    const payPalClient = require('../data/paypalClient');
    
    let func = async () => {
      // 2a. Get the order ID from the request body
      const orderID = req.body.orderID;

      // 3. Call PayPal to get the transaction details
      let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

      let order;
      try {
        order = await payPalClient.client().execute(request);
      } catch (err) {

        // 4. Handle any errors from the call
        console.error(err);
        res.send(500);
      }

      // 5. Validate the transaction details are as expected
      if (order.result.purchase_units[0].amount.value !== '2070.00') {
        res.send(400);
      }

      // 6. Save the transaction in your database
      // await database.saveTransaction(orderID);

      // 7. Return a successful response to the client
      let user = req.cookies['user']
      let start = new Date(Date.now())
      let end = new Date(Date.now())
      end.setMonth(end.getMonth() + 1)
      user.subscription = {
        start, end,
        region: parseInt(user.subscription.region)
      }
      firestore
        .collection('users')
        .add(user)
        .then((ref) => {
          user.id = ref.id
          user.subscription = subscription
          res.cookie('user', user)
          res.send(200);
        })
    }

    func();
  })

  return routes;
});