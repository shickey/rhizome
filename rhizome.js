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

  var data = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

  svg.selectAll('circle')
    .data(data)
    .enter()
      .append('circle')
      .attr("cx", function(d, i) { return (document.body.clientWidth / 2) + (200 * i); })
      .attr("cy", document.body.clientHeight / 2)
      .attr("r", 50)
      .style("fill", "#aaa");
})();