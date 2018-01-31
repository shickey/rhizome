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
  var data = [];
  
  var transformUpdateTimer = null;
  
  var currentTransform = d3.zoomIdentity;
  
  var container = d3.select('.rhizome-container');
  var canvas = container.append('div')
    .attr('id', 'canvas')
    .style('width', '100%')
    .style('height', '100vh')
    .style('min-height', '100vh')
  var zoom = d3.zoom()
    .scaleExtent([0.6, 3])
    .on('zoom', function() {
      currentTransform = d3.event.transform;
      var transformString = 'matrix(' + currentTransform.k + ',0,0,' + currentTransform.k + ',' + currentTransform.x + ',' + currentTransform.y + ')';
      canvas.style('transform', transformString);
      
      // Only update the transform in firebase after the transform hasn't changed for a full second
      if (transformUpdateTimer) {
        window.clearTimeout(transformUpdateTimer);
        transformUpdateTimer = null;
      }
      transformUpdateTimer = window.setTimeout(function() {
        db.ref('transform').set(currentTransform);
        transformUpdateTimer = null;
      }, 1000);
      
    });
  container.call(zoom);
  
  const RESIZE_MARGIN = 4; // px in screen space
  const MIN_NODE_HEIGHT = 32; // px in local node coordinates
  const MIN_NODE_WIDTH  = 64; // px in local node coordinates
  var ResizeTypes = {
    NONE:  1 << 0,
    NORTH: 1 << 1,
    EAST:  1 << 2,
    SOUTH: 1 << 3,
    WEST:  1 << 4
  }
  var shouldResize = ResizeTypes.NONE;
  var resizing = false;
  var resizeOrigin = null;
  
  function nodeMouseEnter(d) {
    if (resizing) { return; }
    updateResizeCursor(this, d);
  }
  
  function nodeMouseMove(d) {
    if (resizing) { return; }
    updateResizeCursor(this, d);
  }
  
  function nodeMouseLeave() {
    var body = d3.select("body");
    if (!resizing) {
      body.style('cursor', null);
      shouldResize = ResizeTypes.NONE;
    }
  }
  
  function updateResizeCursor(node, d) {
    var body = d3.select("body");
    var locationInNode = d3.mouse(node);
    var x = locationInNode[0] / currentTransform.k;
    var y = locationInNode[1] / currentTransform.k;
    var projectedMargin = RESIZE_MARGIN / currentTransform.k;
    
    if (x < projectedMargin) {
      if (y < projectedMargin) {
        body.style('cursor', 'nw-resize');
        shouldResize = ResizeTypes.NORTH | ResizeTypes.WEST;
      }
      else if (y > d.value.h - projectedMargin) {
        body.style('cursor', 'sw-resize');
        shouldResize = ResizeTypes.SOUTH | ResizeTypes.WEST;
      }
      else {
        body.style('cursor', 'w-resize');
        shouldResize = ResizeTypes.WEST;
      }
    }
    else if (x > d.value.w - projectedMargin) {
      if (y < projectedMargin) {
        body.style('cursor', 'ne-resize');
        shouldResize = ResizeTypes.NORTH | ResizeTypes.EAST;
      }
      else if (y > d.value.h - projectedMargin) {
        body.style('cursor', 'se-resize');
        shouldResize = ResizeTypes.SOUTH | ResizeTypes.EAST;
      }
      else {
        body.style('cursor', 'e-resize');
        shouldResize = ResizeTypes.EAST;
      }
    }
    else if (y < projectedMargin) {
      body.style('cursor', 'n-resize');
      shouldResize = ResizeTypes.NORTH;
    }
    else if (y > d.value.h - projectedMargin) {
      body.style('cursor', 's-resize');
      shouldResize = ResizeTypes.SOUTH;
    }
    else {
      body.style('cursor', null);
      shouldResize = ResizeTypes.NONE;
    }
  }
  
  function nodeDragStart(d) {
    d3.select(this).raise();
    if (shouldResize !== ResizeTypes.NONE) {
      resizing = true;
      resizeOrigin = {
        x: d.value.x,
        y: d.value.y,
        w: d.value.w,
        h: d.value.h
      }
    }
  }
  
  function nodeDragDragging(d) {
    var node = d3.select(this);
    if (resizing) {
      
      var mouseX = d3.event.x / currentTransform.k;
      var mouseY = d3.event.y / currentTransform.k;
      
      if (shouldResize & ResizeTypes.SOUTH) {
        d.value.h = Math.max(mouseY - resizeOrigin.y, MIN_NODE_HEIGHT);
        node.style('height', d.value.h + 'px');
      }
      if (shouldResize & ResizeTypes.NORTH) {
        d.value.h = Math.max(resizeOrigin.h - (mouseY - resizeOrigin.y), MIN_NODE_HEIGHT);
        if (d.value.h === MIN_NODE_HEIGHT) {
          d.value.y = resizeOrigin.y + resizeOrigin.h - MIN_NODE_HEIGHT;
        }
        else {
          d.value.y = mouseY;
        }
        node.style('height', d.value.h + 'px');
        node.style('transform', function(d) { return 'translate(' + d.value.x + 'px,' + d.value.y + 'px)'});
      }
      if (shouldResize & ResizeTypes.EAST) {
        d.value.w = Math.max(mouseX - resizeOrigin.x, MIN_NODE_WIDTH);;
        node.style('width', d.value.w + 'px');
      }
      if (shouldResize & ResizeTypes.WEST) {
        d.value.w = Math.max(resizeOrigin.w - (mouseX - resizeOrigin.x), MIN_NODE_WIDTH);
        if (d.value.w === MIN_NODE_WIDTH) {
          d.value.x = resizeOrigin.x + resizeOrigin.w - MIN_NODE_WIDTH;
        }
        else {
          d.value.x = mouseX;
        }
        node.style('width', d.value.w + 'px');
        node.style('transform', function(d) { return 'translate(' + d.value.x + 'px,' + d.value.y + 'px)'});
      }
    }
    else {
      d.value.x += d3.event.dx / currentTransform.k;
      d.value.y += d3.event.dy / currentTransform.k;
      node.style('transform', function(d) { return 'translate(' + d.value.x + 'px,' + d.value.y + 'px)'});
    }
    
  }
  
  function nodeDragEnd(d) {
    if (resizing) {
      resizing = false;
      resizeOrigin = null;
      updateResizeCursor(this, d);
    }
    db.ref('nodes/' + d.key).set(d.value);
  }
  
  var nodeDrag = d3.drag()
    .on('start', nodeDragStart)
    .on('drag', nodeDragDragging)
    .on('end', nodeDragEnd);
  
  function updateNodes() {
    var nodes = canvas.selectAll('div.node')
      .data(data, function(d) { return d.key; });

    nodes.exit().remove();

    var entering = nodes.enter().append('div')
        .attr('class', 'node');

    entering.append('div')
        .attr('class', 'node-title')
      .append('h3')
        .text(function(d) { return d.value.title; });
    
    entering.append('div')
        .attr('class', 'node-content')
        .text(function(d) { return d.value.content; });    

    entering.merge(nodes)
        .style('width', function(d) { return d.value.w + 'px'; })
        .style('height', function(d) { return d.value.h + 'px'; })
        .style('transform', function(d) { return 'translate(' + d.value.x + 'px,' + d.value.y + 'px)'})
        .call(nodeDrag)
        .on('mouseenter', nodeMouseEnter)
        .on('mousemove',  nodeMouseMove)
        .on('mouseleave', nodeMouseLeave);
  }
  
  db.ref('nodes').on('value', function(snapshot) {
    data = d3.entries(snapshot.val());
    updateNodes();
  });
  
  db.ref('transform').on('value', function(snapshot) {
    var t = snapshot.val();
    var newTransform = d3.zoomIdentity.translate(t.x, t.y).scale(t.k);
    container.call(zoom.transform, newTransform);
  });
  
  updateNodes();
  
})();