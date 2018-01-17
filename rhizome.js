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
  var svg = d3.select('body')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .call(d3.zoom().on('zoom', function() {
      svg.attr('transform', d3.event.transform);
    }))
    .append('g');

  svg.append('circle')
    .attr("cx", document.body.clientWidth / 2)
    .attr("cy", document.body.clientHeight / 2)
    .attr("r", 50)
    .style("fill", "#aaa");
})();