import "./Header.css";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from '../api/axios';

export function Header({ isLoggedIn, onLogout, userName }) {
  const location = useLocation();
  const inMainPage = location.pathname === "/";
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userPoint, setUserPoint] = useState(null);

  const invert = inMainPage ? "invert" : "";

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY) {
          setVisible(false);
        } else {
          setVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);

      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
  }, [lastScrollY]);

  useEffect(() => {
    const fetchUserPoint = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('/users/me', {
            headers: { 'Authorization': `${token}` }
          });
          setUserPoint(response.data.data.point);
        } catch (error) {
          console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
        }
      }
    };

    fetchUserPoint();
  }, [isLoggedIn]);

  const goLandingPage = () => {
    window.location.href = "/";
  };

  return (
    <header className={`${visible ? 'visible' : 'hidden'}`}>
      <Link to="/" id="logo" className={invert} onClick={goLandingPage}>당근마차</Link>
      <Link to="/guide" className={invert}>이용가이드</Link>
      <Link to="/main" id="logo" className={invert}>체험해보기</Link>
      {isLoggedIn && userPoint !== null && (
        <span className={invert}>포인트: {userPoint}</span>
      )}
      {isLoggedIn && (
        <Link className={`user-menu ${invert}`}>
          {userName} 님 안녕하세요
          <nav>
            <Link to='/mypage'>마이페이지</Link>
            {/* <Link to='/history'>이용 내역</Link> */}
          </nav>
        </Link>
      )}
      {isLoggedIn ? (
        <button onClick={onLogout} className={invert}>로그아웃</button>
      ) : (
        <Link to="/login" className={invert}>로그인</Link>
      )}
      {!isLoggedIn && (
        <Link to="/signup" className={invert}>회원가입</Link>
      )}
    </header>
  );
}
