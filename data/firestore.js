/* const firebase = require('firebase')

const config = {
  apiKey: "AIzaSyCwoO68aisuZYeBbxFxqnZy_N_-AyXJ1Mk",
  authDomain: "bluehacks-1582339768108.firebaseapp.com",
  databaseURL: "https://bluehacks-1582339768108.firebaseio.com",
  projectId: "bluehacks-1582339768108",
  storageBucket: "bluehacks-1582339768108.appspot.com",
  messagingSenderId: "639822229381",
  appId: "1:639822229381:web:bd650a6a6acba7625adeec",
  measurementId: "G-S18FPTBZB4"
}
firebase.initializeApp(config)

module.exports = firebase */

const admin = require('firebase-admin')
let service = require("./service.json")

admin.initializeApp({
  credential: admin.credential.cert(service)
})

module.exports = admin.firestore()