import colorbrewer from './colorbrewer'


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
    .attr('r', 0)
    .transition()
    .delay((d, i) => i * 100)
    .duration(500)
    .attr('r', 40)
    .transition()
    .duration(500)
    .attr('r', 20)

  teamG.append('text')
    .attr('class', 'team')
    .style('text-anchor', 'middle')
    .attr('y', 30)
    .text(d => d.team)

  teamG.append('text')
    .attr('class', 'value')
    .style('text-anchor', 'middle')
    .attr('y', -30)

  d3.selectAll('circle').on('mouseover', highlight)

  d3.selectAll('circle').on('mouseout', unhighlight)

  let dataKeys = d3.keys(data[0]).filter(el => el !== 'team' && el !== 'region')

  d3.select('#controls').selectAll('button.teams')
    .data(dataKeys)
    .enter()
    .append('button')
    .on('click', d => handleClick(d, data))
    .html(d => d)
}

function highlight(d, i) {
  d3.selectAll('circle').each(function(p, i) {
    p.region === d.region ?
      d3.select(this).classed('active', true) :
      d3.select(this).classed('inactive', true)
  })
}

function unhighlight() {
  d3.selectAll('circle').attr('class', '')
}

function handleClick(key, data) {
  let maxValue = d3.max(data, d => parseFloat(d[key]))
  let radiusScale = d3.scale.linear().domain([0, maxValue]).range([3, 20])
  let colorQuantize = d3.scale.quantize()
    .domain([0, maxValue]).range(colorbrewer.Reds[5])

  let teamG = d3.selectAll('g.overallG')
  teamG.select('text.value')
    .text(d => d[key])
    .transition()
    .style('font-size', '20px')
    .transition()
    .style('font-size', '10px')

  teamG.select('circle')
    .transition()
    .attr('r', d => radiusScale(d[key]))
    .style('fill', d => colorQuantize(d[key]))
}
