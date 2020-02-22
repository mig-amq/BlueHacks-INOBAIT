module.exports = (function () {
  'use strict';

  const express = require('express')
  const routes = express.Router();

  routes.get('/', (req, res) => {
    res.send({})
  })

  // Returns list of all users
  routes.get('/users', (req, res) => {

  })

  // Returns details of a user
  routes.get('/users/:userID', (req, res) => {

  })

  // Returns regional dishes
  routes.get('/regions/dishes', (req, res) => {

  })

  // Returns regions
  routes.get("/regions", (req, res) => {

  })

  // Returns QR Text
  routes.get('/qr/:qrID', (req, res) => {

  })
  return routes;
});