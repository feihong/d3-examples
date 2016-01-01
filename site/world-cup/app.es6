d3.csv('stats.csv', (error, data) => {
  dataViz(data);
})

function dataViz(data) {
  d3.select('svg')
    .append('g')
    .attr('id', 'teamsG')
    .attr('transform', 'translate(50, 300)')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'overallG')
    .attr('transform', (d, i) => `translate(${i*50},0)`)

  let teamG = d3.selectAll('g.overallG')

  teamG.append('circle')
    .attr('r', 20)

  teamG.append('text')
    .style('text-anchor', 'middle')
    .attr('y', 30)
    .text(d => d.team)

  teamG.append('text')
    .attr('class', 'value')
    .style('text-anchor', 'middle')
    .attr('y', -30)

  let dataKeys = d3.keys(data[0]).filter(el => el !== 'team' && el !== 'region')

  d3.select('#controls').selectAll('button.teams')
    .data(dataKeys)
    .enter()
    .append('button')
    .on('click', d => handleClick(d, data))
    .html(d => d)
}

function handleClick(key, data) {
  let maxValue = d3.max(data, d => parseFloat(d[key]))
  let radiusScale = d3.scale.linear().domain([0, maxValue]).range([2, 20])

  let teamG = d3.selectAll('g.overallG')
  teamG.select('text.value')
    .text(d => d[key])
  teamG.select('circle')
    .transition()
    .attr('r', d => radiusScale(d[key]))
}
