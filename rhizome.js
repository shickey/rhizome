/*
 * Rhizome
 *
 * Collective knowledge building
 *
 * Sean Hickey
 * MIT Media Lab, Lifelong Kindergarten Group
 * 17 Jan 2018
 *
 */

;(function() {

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

  var initialZoom = d3.zoomIdentity.translate((-document.body.clientWidth / 2), (-document.body.clientHeight / 2)).scale(1);
  var zoom = d3.zoom().on('zoom', function() {
    d3.select('svg').attr('transform', d3.event.transform);
  });
  var svg = d3.select('body')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .call(zoom)
    .call(zoom.transform, initialZoom)
    .append('g')
      .attr('transform', initialZoom);


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

  svg.selectAll('circle')
    .data(data)
    .enter()
      .append('circle')
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", 50)
      .style("fill", function(d) { return d.color; });
})();