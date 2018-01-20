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
  var zoom = d3.zoom()
    .filter(function() {
      return (!d3.event.button && !d3.event.altKey);
    })
    .on('zoom', function() {
      svg.attr('transform', d3.event.transform);
    });
  var svg = d3.select('body')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .call(zoom)
    .append('g');
  
  var nodeData = [];
  var edgeData = [];
  
  function nodeDragStart(d) {
    d3.select(this).raise();
  }
  
  function nodeDragDragging(d) {
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
    .filter(function() {
      return (!d3.event.button && !d3.event.altKey);
    })
    .on('start', nodeDragStart)
    .on('drag', nodeDragDragging)
    .on('end', nodeDragEnd);
  
  var addingEdge = null;
  function nodeMouseDown(d) {
    if (d3.event.altKey && !addingEdge) {
      // Capture the id of the first node
      addingEdge = d.key;
    }
  }
  
  function nodeMouseUp(d) {
    if (addingEdge && d.key !== addingEdge) {
      // If we've successfully dragged to a different node,
      // create an edge
      //
      // TODO: Should it be possible to create an edge
      //       with the same start and end node?
      //
      // TODO: Should we check for duplicate edges?
      edgeData.push({
        start: addingEdge,
        end: d.key
      });
    }
    addingEdge = null;
    updateEdges();
  }
  
  function updateNodes() {
    svg.selectAll('circle')
    .data(d3.entries(nodeData))
      .attr('cx', function(d) { return d.value.x; })
      .attr('cy', function(d) { return d.value.y; })
      .attr('r', 50)
      .style('fill', function(d) { return d.value.color; })
      .call(nodeDrag)
      .on('mousedown', nodeMouseDown)
      .on('mouseup', nodeMouseUp)
    .enter()
      .append('circle')
      .attr('cx', function(d) { return d.value.x; })
      .attr('cy', function(d) { return d.value.y; })
      .attr('r', 50)
      .style('fill', function(d) { return d.value.color; })
      .call(nodeDrag)
      .on('mousedown', nodeMouseDown)
      .on('mouseup', nodeMouseUp)
    .exit()
      .remove();
    updateEdges();
  }
  
  function updateEdges() {
    svg.selectAll('line')
    .data(edgeData)
      .attr('x1', function(d) { return nodeData[d.start].x; })
      .attr('y1', function(d) { return nodeData[d.start].y; })
      .attr('x2', function(d) { return nodeData[d.end].x; })
      .attr('y2', function(d) { return nodeData[d.end].y; })
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
    .enter()
      .append('line')
      .attr('x1', function(d) { return nodeData[d.start].x; })
      .attr('y1', function(d) { return nodeData[d.start].y; })
      .attr('x2', function(d) { return nodeData[d.end].x; })
      .attr('y2', function(d) { return nodeData[d.end].y; })
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
    .exit()
      .remove();
  }
  
  db.ref('nodes').on('value', function(snapshot) {
    nodeData = snapshot.val();
    updateNodes();
  });
  
  updateNodes();
  
})();