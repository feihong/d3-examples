d3.json('tweets.json', (error, data) => {
  barChart(data.tweets)
  scatterPlot(data.tweets)
})

function barChart(data) {
  let nestedTweets = d3.nest().key(el => el.user).entries(data)
  nestedTweets.forEach(el => el.numTweets = el.values.length)

  let maxTweets = d3.max(nestedTweets, el => el.numTweets)

  let yScale = d3.scale.linear().domain([0, maxTweets]).range([0, 100])

  d3.select('svg.bar')
    .selectAll('rect')
    .data(nestedTweets)
    .enter()
    .append('rect')
    .attr('width', 50)
    .attr('height', d => yScale(d.numTweets))
    .attr('x', (d, i) => i * 60)
    .attr('y', d => 100 - yScale(d.numTweets))
    .style('fill', 'blue')
    .style('stroke', 'red')
    .style('stroke-width', '1px')
    .style('opacity', 0.5)
}

function scatterPlot(data) {
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

  let tweetG = d3.select('svg.scatter')
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
    d3.select('svg.scatter')
      .selectAll('g')
      .data(filteredData, d => d.key)
      .exit()
      .remove()
  })
} // scatterPlot
