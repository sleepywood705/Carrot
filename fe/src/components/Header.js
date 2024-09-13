import "./Header.css";
import { Nav } from "./Nav";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";


export function Header({ isLoggedIn, onLogout, userName }) {
  const location = useLocation();
  const inMainPage = location.pathname === "/";
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const invert = inMainPage ? "invert" : "";

  return (
    <header>
      <Link to="/" id="logo" className={invert}>당근마차</Link>
      <Link to="/guide" className={invert}>이용가이드</Link>
      {isLoggedIn && (
        <button className={invert} onClick={toggleNav}>
          {userName}님 ㅎㅇ
        </button>
      )}
      {isLoggedIn ? (
        <button onClick={onLogout} className={invert}>로그아웃</button>
      ) : (
        <Link to="/login" className={invert}>로그인</Link>
      )}
      {!isLoggedIn &&
        <Link to="/signup" className={invert}>회원가입</Link>
      }
      {showNav && (
        <Nav onClose={toggleNav} userName={userName} />
      )}
    </header>
  );
}
