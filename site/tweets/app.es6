d3.json('tweets.json', (error, data) => dataViz(data.tweets))
function dataViz(data) {
//=============================================================================

data.forEach(el => {
  el.impact = el.favorites.length + el.retweets.length
  el.tweetTime = new Date(el.timestamp)
})

let maxImpact = d3.max(data, el => el.impact)

let startEnd = d3.extent(data, el => el.tweetTime)
console.log(startEnd);
let timeRamp = d3.time.scale().domain(startEnd).range([20, 480])
let yScale = d3.scale.linear().domain([0, maxImpact]).range([1, 460])
let radiusScale = d3.scale.linear().domain([0, maxImpact]).range([1, 20])
let colorScale = d3.scale.linear().domain([0, maxImpact]).range(['white', '#990000'])

d3.select('svg')
  .selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('r', d => radiusScale(d.impact))
  .attr('cx', d => timeRamp(d.tweetTime))
  .attr('cy', d => 480 - yScale(d.impact))
  .style('fill', d => colorScale(d.impact))
  .style('stroke', 'black')
  .style('stroke-width', '1px')

//=============================================================================
} // dataViz
