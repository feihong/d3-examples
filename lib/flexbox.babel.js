import React from 'react'


export class VBox extends React.Component {
  render() {
    return renderBox(false, this.props)
  }
}


export class HBox extends React.Component {
  render() {
    return renderBox(true, this.props)
  }
}


function renderBox(isHorizontal, props) {
  let className = isHorizontal ? 'hbox' : 'vbox'

  // Merge style.
  let newStyle = Object.assign({}, props.style)
  Object.assign(newStyle, {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column'
  })

  return <div {...props} className={className} style={newStyle}>
    {props.children}
  </div>
}
