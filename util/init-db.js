/*
 * Rhizome
 * init-db.js
 *
 * Resets and populates the firebase data store for testing, etc.
 *
 * Sean Hickey
 * MIT Media Lab, Lifelong Kindergarten Group
 * 18 Jan 2018
 *
 */
 
 var firebase = require('firebase');
 
'use strict';

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBaWc2sIScNik2lrUdr4DQOz1tyC_F48Ww",
  authDomain: "rhizome-18e8b.firebaseapp.com",
  databaseURL: "https://rhizome-18e8b.firebaseio.com",
  projectId: "rhizome-18e8b",
  storageBucket: "rhizome-18e8b.appspot.com",
  messagingSenderId: "614011893394"
};
firebase.initializeApp(firebaseConfig);

var data = [
  {
    x: 0,
    y: 0,
    color: "red"
  },
  {
    x: 100,
    y: 0,
    color: "orange"
  },
  {
    x: 150,
    y: 100,
    color: "yellow"
  },
  {
    x: -100,
    y: 100,
    color: "green"
  },
  {
    x: 300,
    y: 50,
    color: "blue"
  },
  {
    x: 100,
    y: -150,
    color: "purple"
  },
];

var db = firebase.database();
var nodesRef = db.ref('nodes');

nodesRef.set({})
  .then(function() {
    var updates = {};
    data.forEach(function(d) {
      updates[nodesRef.push().key] = d;
    })
    nodesRef.update(updates).then(function() {
      process.exit();
    });
  });
 