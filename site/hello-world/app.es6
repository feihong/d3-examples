d3.select('svg')
  .append('line')
  .attr('id', 'line')
  .attr('x1', 30)
  .attr('y1', 35)
  .attr('x2', 400)
  .attr('y2', 400)
  .style('stroke', 'black')
  .style('stroke-width', '6px')

d3.select('svg')
  .append('circle')
  .attr('id', 'redcircle')
  .attr('r', 40)
  .attr('cx', 40)
  .attr('cy', 40)
  .style('fill', 'red')

  d3.select('svg')
    .append('text')
    .attr('id', 'hello')
    .attr('opacity', 0)
    .attr('x', 16)
    .attr('y', 45)
    .text('HELLO')

d3.select('svg')
  .append('circle')
  .attr('id', 'bluecircle')
  .attr('r', 100)
  .attr('cx', 400)
  .attr('cy', 400)
  .style('fill','lightblue')

d3.select('svg')
  .append('text')
  .attr('id', 'world')
  .attr('opacity', 0)
  .attr('x', 370)
  .attr('y', 400)
  .text('WORLD')

d3.select('#hello').transition().delay(500).style('opacity', 1)
d3.select('#world').transition().delay(1000).style('opacity', 1)

let toggle = true

d3.select('button').on('click', () => {
  toggle = !toggle
  let opacity = toggle ? 1 : 0
  d3.select('#redcircle').transition().style('opacity', opacity)
  d3.select('#bluecircle').transition().style('opacity', opacity)

  opacity = toggle ? 1 : 0.3
  let dash = toggle ? '' : '10,8'
  let width = toggle ? '6px' : '1px'
  d3.select('#line').transition().duration(1500)
    .style('stroke-opacity', opacity)
    .style('stroke-dasharray', dash)
    .style('stroke-width', width)
})
