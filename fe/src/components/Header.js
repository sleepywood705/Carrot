import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { PersonalNav } from './Nav_Personal';  // Nav_Personal 컴포넌트 import

export function Header({ isLoggedIn, username, onLogout }) {
	const location = useLocation();
	const onBoarding = location.pathname === '/';
	const [showPersonalNav, setShowPersonalNav] = useState(false); // 상태 관리 추가

	const togglePersonalNav = () => {
		setShowPersonalNav(!showPersonalNav);
	};

	return (
		<header>
			<Link to="/" id="logo" className={onBoarding ? 'invert' : ''}>당근마차</Link>
			<Link to="/guide" className={onBoarding ? 'invert' : ''}>이용가이드</Link>
			{isLoggedIn && (
				<button 
					className={onBoarding ? 'invert' : ''} 
					onClick={togglePersonalNav}
				>
					{username}님 ㅎㅇ
				</button>
			)}
			{isLoggedIn ? (
				<button onClick={onLogout} className={onBoarding ? 'invert' : ''}>로그아웃</button>
			) : (
				<Link to="/login" className={onBoarding ? 'invert' : ''}>로그인</Link>
			)}
			<Link to="/signup" className={onBoarding ? 'invert' : ''}>회원가입</Link>
			{showPersonalNav && <PersonalNav onClose={togglePersonalNav} username={username} />}
		</header>
	);
}
