d3.json('tweets.json', (error, data) => dataViz(data.tweets))
function dataViz(data) {
//=============================================================================

data.forEach(el => {
  el.impact = el.favorites.length + el.retweets.length
  el.tweetTime = new Date(el.timestamp)
  el.key = `${el.user}-${el.timestamp}`
})

let maxImpact = d3.max(data, el => el.impact)

let startEnd = d3.extent(data, el => el.tweetTime)
let timeRamp = d3.time.scale().domain(startEnd).range([20, 480])
let yScale = d3.scale.linear().domain([0, maxImpact]).range([1, 460])
let radiusScale = d3.scale.linear().domain([0, maxImpact]).range([1, 20])
let colorScale = d3.scale.linear().domain([0, maxImpact]).range(['white', '#990000'])

let tweetG = d3.select('svg')
  .selectAll('g')
  .data(data, d => d.key)
  .enter()
  .append('g')
  .attr('transform', d => `translate(${timeRamp(d.tweetTime)},${480 - yScale(d.impact)})`)

tweetG.append('circle')
  .attr('r', d => radiusScale(d.impact))
  .style('fill', d => colorScale(d.impact))
  .style('stroke', 'black')
  .style('stroke-width', '1px')

tweetG.append('text')
  .text(d => `${d.user}-${d.tweetTime.getHours()}`)

d3.select('button').on('click', () => {
  let filteredData = data.filter(el => el.impact > 0)
  d3.selectAll('g')
    .data(filteredData, d => d.key)
    .exit()
    .remove()
})

//=============================================================================
} // dataViz
