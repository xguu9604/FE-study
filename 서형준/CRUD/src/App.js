import './App.css';
import { useState } from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import Article from './components/Article';
import Create from './components/Create';
import Update from './components/Update';


function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState();
  const [nextId, setNextId] = useState(4);

  const [topics, setTopics] = useState([
    {id: 1, title: '1제목', body: '1 is...'},
    {id: 2, title: '2제목', body: '2 is...'},
    {id: 3, title: '3제목', body: '3 is...'}
  ])

  let content = null;
  let contextControl = null;

  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, Main"></Article>
  } else if (mode === 'READ') {
    let title, body = '';
    for (let i=0; i<topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li><a href={'/update'+id} onClick={(event) => {
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={() => {
        const newTopics = []
        for (let i=0; i<topics.length; i++) {
          if (topics[i].id !== id) {
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics)
        setMode('WELCOME')
      }}/></li>
    </>
  } else if (mode === 'CREATE') {
    content = <Create onCreate={(_title, _body) => {
      const newTopic = {id: nextId, title: _title, body: _body}
      const newTopics = [...topics]
      newTopics.push(newTopic)
      // setTopics함수는 기존값과 변경된 값이 다른 경우에 재랜더링 하는 상황인데
      // 여기서 원본에 그냥 값을 push하고 setTopics를 부르면 원본값이 변한게 없다고 판단
      // 따라서 객체나 배열 값을 변경하고자 하는 경우에는 복제본을 건드리고 set에 넣는것!!
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId + 1);
    }}></Create>
  } else if (mode === 'UPDATE') {
    let title, body = '';
    for (let i=0; i<topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      };
    };
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      const newTopics = [...topics]
      const updatedTopic = {id: id, title: title, body: body}
      for (let i=0; i<newTopics.length; i++) {
        if (newTopics[i].id === id) {
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ')
    }}></Update>
  }

  return (
    <div className="App">
      {/* 저기 onChangeMode도 props형태로 전해주는 함수 */}
      <Header title="REACT" onChangeMode={function () {
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={function (_id) {
        setMode('READ');
        setId(_id)
      }}></Nav>
      {content}
      <ul>
        <li>
          <a href='/create' onClick={(event) => {
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
