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
  
  var db = firebase.database();

  // var initialZoom = d3.zoomIdentity.translate((-document.body.clientWidth / 2), (-document.body.clientHeight / 2)).scale(1);
  // var zoom = );
  var svg = d3.select('body')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .call(d3.zoom().on('zoom', function() {
      svg.attr('transform', d3.event.transform);
    }))
    .append('g');
  
  var data = [];
  
  function nodeDragStart(d) {
    d3.select(this).raise();
  }
  
  function nodeDragDragging(d) {
    // debugger;
    var newX = d.value.x + d3.event.dx;
    var newY = d.value.y + d3.event.dy;
    d.value.x = newX;
    d.value.y = newY;
    d3.select(this)
      .attr('cx', newX)
      .attr('cy', newY);
  }
  
  function nodeDragEnd(d) {
    db.ref('nodes/' + d.key).set(d.value);
  }
  
  var nodeDrag = d3.drag()
    .on('start', nodeDragStart)
    .on('drag', nodeDragDragging)
    .on('end', nodeDragEnd)
  
  function updateNodes() {
    svg.selectAll('circle')
    .data(data)
      .attr('cx', function(d) { return d.value.x; })
      .attr('cy', function(d) { return d.value.y; })
      .attr('r', 50)
      .style('fill', function(d) { return d.value.color; })
      .call(nodeDrag)
    .enter()
      .append('circle')
      .attr('cx', function(d) { return d.value.x; })
      .attr('cy', function(d) { return d.value.y; })
      .attr('r', 50)
      .style('fill', function(d) { return d.value.color; })
      .call(nodeDrag)
    .exit()
      .remove();
  }
  
  db.ref('nodes').on('value', function(snapshot) {
    data = d3.entries(snapshot.val());
    updateNodes();
  });
  
  updateNodes();
  
})();