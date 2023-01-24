import React from 'react'

function Header(props) {
  console.log(props, 'props', props.title)
  return <header>
            <h1><a href='/' onClick={function (event) {
              event.preventDefault();
              props.onChangeMode();
            }}>{props.title}</a></h1>
          </header>
}

export default Header