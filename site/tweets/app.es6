d3.json('tweets.json', (error, data) => dataViz(data))
function dataViz(data) {
//=============================================================================

let nestedTweets = d3.nest().key(el => el.user).entries(data.tweets)
nestedTweets.forEach(el => el.numTweets = el.values.length)

let maxTweets = d3.max(nestedTweets, el => el.numTweets)

let yScale = d3.scale.linear().domain([0, maxTweets]).range([0, 400])

d3.select('svg')
  .selectAll('rect')
  .data(nestedTweets)
  .enter()
  .append('rect')
  .attr('width', 50)
  .attr('height', d => yScale(d.numTweets))
  .attr('x', (d, i) => i * 60)
  .attr('y', d => 400 - yScale(d.numTweets))
  .style('fill', 'blue')
  .style('stroke', 'red')
  .style('stroke-width', '1px')
  .style('opacity', 0.5)

//=============================================================================
} // dataViz
