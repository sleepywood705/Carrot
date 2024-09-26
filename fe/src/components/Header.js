import "./Header.css";
import { Nav } from "./Nav";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export function Header({ isLoggedIn, onLogout, userName }) {
  const location = useLocation();
  const inMainPage = location.pathname === "/";
  const [showNav, setShowNav] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const invert = inMainPage ? "invert" : "";

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY) { // 스크롤 내릴 때
          setVisible(false);
        } else { // 스크롤 올릴 때
          setVisible(true);
        }
        // 현재 스크롤 위치 업데이트
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <header className={`${visible ? 'visible' : 'hidden'}`}>
      <Link to="/" id="logo" className={invert}>당근마차</Link>
      <Link to="/guide" className={invert}>이용가이드</Link>
      <Link to="/main" id="logo" className={invert}>체험해보기</Link>
      {isLoggedIn && (
        <button className={invert} onClick={()=>toggleNav()}>
          {userName} 님 안녕하세요
        </button>
      )}
      {isLoggedIn ? (
        <button onClick={()=>onLogout()} className={invert}>로그아웃</button>
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
