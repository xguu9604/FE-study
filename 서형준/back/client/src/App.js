import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import Auth from './hoc/auth'

function App() {

  // null => 아무나 출입 가능
  // true => 로그인 한 유저만 가능
  // false => 로그인 안 한 유저만 가능
  // const AuthenticPage = Auth({LandingPage}, null)
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" component={Auth(LandingPage, null)}/>
          <Route exact path="/login" element={<LoginPage/>} />
          <Route exact path="/register" element={<RegisterPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

