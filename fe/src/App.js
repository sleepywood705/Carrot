import "./global.css";
import "./font.css";
import "./App.css";
import { Landing } from "./routes/Landing";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
// import { Main } from "./routes/Main";
import { Main2 } from "./routes/Main2";
import { Guide } from "./routes/Guide";
import { Login } from "./routes/Login";
import { Signup } from "./routes/Signup";
import { Mypage } from "./routes/Mypage";
import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import axios from './api/axios';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 토큰이 있으면 사용자 정보를 가져와 로그인 상태를 복원
      const fetchUserData = async () => {
        try {
          const response = await axios.get('/users/me', {
            headers: { Authorization: token }
          });
          const userName = response.data.data.name;
          setUserName(userName);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // 토큰이 유효하지 않으면 로그아웃 처리
          handleLogout();
        }
      };
      fetchUserData();
    }
  }, []);  // 컴포넌트 마운트 시 한 번만 실행

  const handleLogin = (userName) => {
    setUserName(userName);
    setIsLoggedIn(true);
    // navigate("/main");
    navigate("/main2");
  };

  const handleLogout = () => {
    setUserName("");
    setIsLoggedIn(false);
    // navigate("/main");
    navigate("/main2");
    localStorage.removeItem("token");
  };

  return (
    <div className="App">
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userName={userName}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/main" element={<Main />} /> */}
        <Route path="/main2" element={<Main2 />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
