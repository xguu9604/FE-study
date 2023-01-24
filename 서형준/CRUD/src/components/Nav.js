import React from 'react'

function Nav(props) {
  const lst = []

  for (let i=0; i<props.topics.length; i++) {
    let t = props.topics[i];
    // props를 여러개 보낼때 고유한(unique) 키를 넘겨줘야함
    lst.push(<li key={t.id}>
      <a id={t.id} href={'/read/' + t.id} onClick={(event) => {
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
      </li>)
  }

  return  <nav>
            <ol>
              {lst}
            </ol>
          </nav>
}

export default Nav