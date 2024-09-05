import './global.css';
import './font.css';
import './App.css';
import { Landing } from './routes/Landing';
import { Header }  from './components/Header';
import { Footer } from './components/Footer';
import { Main }  from './routes/Main';
import { Login } from './routes/Login';
import { Mypage } from './routes/Mypage'
import { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';


function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);  // 라우팅 시 스크롤을 맨 위로 이동
  }, [location]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
    navigate(-1);  // 이전 경로로 리다이렉션
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  };
  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/Main" element={<Main/>}/>
        {/* <Route path="/Guide" element={<Guide/>}/> */}
        <Route path="/Mypage" element={<Mypage/>}/>
        <Route path="/Login" element={<Login onLogin={handleLogin} />}/>
      </Routes>
      <Footer/>
    </div>
  ); 
}

export default App;
