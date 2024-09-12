import "./global.css";
import "./font.css";
import "./App.css";
import { Landing } from "./routes/Landing";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Main } from "./routes/Main";
import { Guide } from "./routes/Guide";
import { Login } from "./routes/Login";
import { Signup } from "./routes/Signup";
import { Mypage } from "./routes/Mypage";
import { Mypage2 } from "./routes/Mypage2";
import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (user) => {
    setUserName(user);
    setIsLoggedIn(true);
    navigate("/main");
  };

  const handleLogout = () => {
    setUserName("");
    setIsLoggedIn(false);
    navigate("/main");
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
        <Route path="/main" element={<Main />} />
        <Route path="/guide" element={<Guide />} />
        {/* <Route path="/mypage" element={<Mypage/>}/> */}
        <Route path="/mypage" element={<Mypage2 />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {/* <Footer/> */}
    </div>
  );
}

export default App;
