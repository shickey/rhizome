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

  var container = d3.select('#container')
  var canvas = container.append('div')
    .attr('id', 'canvas')
    .style('width', '100%')
    .style('height', '100vh')
    .style('min-height', '100vh');
  container.call(d3.zoom()
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
      title: "hello world!",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ante libero, bibendum quis fringilla in, volutpat eu sem. Nam eget ex quis diam lobortis volutpat. Quisque aliquet risus non enim vulputate, nec porttitor lorem pretium. Nulla rutrum metus sit amet interdum porttitor. Phasellus consequat metus ut nibh placerat, ut placerat quam sodales. Aliquam nec hendrerit tellus. Duis ut justo nibh. Cras porta justo quis turpis auctor, ac tincidunt eros imperdiet. Maecenas eu nisi felis. Sed nisl ex, porttitor eu elit eu, vehicula interdum nunc. Donec mi enim, cursus quis dignissim eu, vestibulum eget libero."
    },
    {
      x: 300,
      y: 750,
      w: 100,
      h: 50,
      title: "foo bar baz!",
      content: "Nullam erat lorem, ornare eget tincidunt in, blandit vitae ex. Praesent efficitur eget dui sit amet pretium. Curabitur suscipit ut dui ultrices convallis. Morbi eget pharetra nisl, nec consequat quam. Aliquam finibus mi arcu, et scelerisque enim malesuada vitae. Suspendisse sodales nibh sed augue sollicitudin, non faucibus magna auctor. Aenean augue ipsum, facilisis vel ligula quis, dapibus rutrum risus. Curabitur a malesuada justo. Praesent nisl ex, volutpat et elit eu, porttitor cursus velit. Morbi aliquam, turpis id interdum sollicitudin, diam arcu consequat purus, posuere elementum odio augue sed urna. Integer posuere dapibus tristique. Curabitur aliquet sed nisi ut blandit. Pellentesque ac sollicitudin nulla, ut commodo orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    }
  ];
  
  const RESIZE_MARGIN = 4; // px in screen space
  var ResizeTypes = {
    NONE:  1 << 0,
    NORTH: 1 << 1,
    EAST:  1 << 2,
    SOUTH: 1 << 3,
    WEST:  1 << 4
  }
  var shouldResize = ResizeTypes.NONE;
  var resizing = false;
  
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
      else if (y > d.h - projectedMargin) {
        body.style('cursor', 'sw-resize');
        shouldResize = ResizeTypes.SOUTH | ResizeTypes.WEST;
      }
      else {
        body.style('cursor', 'w-resize');
        shouldResize = ResizeTypes.WEST;
      }
    }
    else if (x > d.w - projectedMargin) {
      if (y < projectedMargin) {
        body.style('cursor', 'ne-resize');
        shouldResize = ResizeTypes.NORTH | ResizeTypes.EAST;
      }
      else if (y > d.h - projectedMargin) {
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
    else if (y > d.h - projectedMargin) {
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
    }
  }
  
  function nodeDragDragging(d) {
    var node = d3.select(this);
    var deltaX = d3.event.dx / currentTransform.k;
    var deltaY = d3.event.dy / currentTransform.k;
    if (resizing) {
      if (shouldResize & ResizeTypes.SOUTH) {
        d.h += deltaY;
        node.style('height', d.h + 'px');
      }
      if (shouldResize & ResizeTypes.NORTH) {
        d.y += deltaY;
        d.h -= deltaY;
        node.style('height', d.h + 'px');
        node.style('transform', function(d) { return 'translate(' + d.x + 'px,' + d.y + 'px)'});
      }
      if (shouldResize & ResizeTypes.EAST) {
        d.w += deltaX;
        node.style('width', d.w + 'px');
      }
      if (shouldResize & ResizeTypes.WEST) {
        d.x += deltaX;
        d.w -= deltaX;
        node.style('width', d.w + 'px');
        node.style('transform', function(d) { return 'translate(' + d.x + 'px,' + d.y + 'px)'});
      }
    }
    else {
      d.x += deltaX;
      d.y += deltaY;
      node.style('transform', function(d) { return 'translate(' + d.x + 'px,' + d.y + 'px)'});
    }
    
  }
  
  function nodeDragEnd(d) {
    if (resizing) {
      resizing = false;
      updateResizeCursor(this, d);
    }
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
        .attr('class', 'node');

    entering.append('div')
        .attr('class', 'node-title')
      .append('h3')
        .text(function(d) { return d.title; });
    
    entering.append('div')
        .attr('class', 'node-content')
        .text(function(d) { return d.content; });    

    entering.merge(nodes)
        .style('width', function(d) { return d.w + 'px'; })
        .style('height', function(d) { return d.h + 'px'; })
        .style('transform', function(d) { return 'translate(' + d.x + 'px,' + d.y + 'px)'})
        .call(nodeDrag)
        .on('mouseenter', nodeMouseEnter)
        .on('mousemove',  nodeMouseMove)
        .on('mouseleave', nodeMouseLeave);
  }
  
  // db.ref('nodes').on('value', function(snapshot) {
  //   data = d3.entries(snapshot.val());
  //   updateNodes();
  // });
  
  updateNodes();
  
})();