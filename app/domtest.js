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
  // var firebaseConfig = {
  //   apiKey: "AIzaSyBaWc2sIScNik2lrUdr4DQOz1tyC_F48Ww",
  //   authDomain: "rhizome-18e8b.firebaseapp.com",
  //   databaseURL: "https://rhizome-18e8b.firebaseio.com",
  //   projectId: "rhizome-18e8b",
  //   storageBucket: "rhizome-18e8b.appspot.com",
  //   messagingSenderId: "614011893394"
  // };
  // firebase.initializeApp(firebaseConfig);
  
  // var db = firebase.database();
  
  var currentTransform = d3.zoomIdentity;

  var canvas = d3.select('#canvas');
  var container = d3.select('#container')
    .append('div')
    .attr('id', 'canvas')
    .style('width', '100%')
    .style('height', '100vh')
    .style('min-height', '100vh')
    .call(d3.zoom()
      .scaleExtent([0.6, 3])
      .on('zoom', function() {
        currentTransform = d3.event.transform;
        var transformString = 'matrix(' + currentTransform.k + ',0,0,' + currentTransform.k + ',' + currentTransform.x + ',' + currentTransform.y + ')';
        canvas.style('transform', transformString);
      }));
  
  var data = [
    {
      x: 100,
      y: 100,
      w: 200,
      h: 100,
      content: "hello world!"
    },
    {
      x: 300,
      y: 750,
      w: 100,
      h: 50,
      content: "foo bar baz!"
    }
  ];
  
  function nodeDragStart(d) {
    d3.select(this).raise();
  }
  
  function nodeDragDragging(d) {
    var newX = d.x + d3.event.dx / currentTransform.k;
    var newY = d.y + d3.event.dy / currentTransform.k;
    d.x = newX;
    d.y = newY;
    d3.select(this)
      .style('transform', function(d) { return 'translate(' + newX + 'px,' + newY + 'px)'});
  }
  
  function nodeDragEnd(d) {
    // db.ref('nodes/' + d.key).set(d.value);
  }
  
  var nodeDrag = d3.drag()
    .on('start', nodeDragStart)
    .on('drag', nodeDragDragging)
    .on('end', nodeDragEnd);
  
  function updateNodes() {
    var nodes = canvas.selectAll('div.node')
      .data(data);

    nodes.exit().remove();

    var entering = nodes.enter().append('div')
        .attr('class', 'node')
        .style('position', 'absolute');

    entering.append('span').text(function(d) { return d.content; });

    entering.merge(nodes)
        .style('width', function(d) { return d.w + 'px'; })
        .style('height', function(d) { return d.h + 'px'; })
        .style('transform', function(d) { return 'translate(' + d.x + 'px,' + d.y + 'px)'})
        .call(nodeDrag);
  }
  
  // db.ref('nodes').on('value', function(snapshot) {
  //   data = d3.entries(snapshot.val());
  //   updateNodes();
  // });
  
  updateNodes();
  
})();