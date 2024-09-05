import './Header.css';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import ProfileNavbar from './ProfileNavbar';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // useLocation 추가

export function Header() {

	const location = useLocation(); // 현재 경로 가져옴
	const isLandingPage = location.pathname === '/'; // Landing 페이지인지 확인함

	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showSignupModal, setShowSignupModal] = useState(false);
	const [showProfileNavbar, setShowProfileNavbar] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState('');

	const handleLogin = (loggedInUsername) => {
		setIsLoggedIn(true);
		setUsername(loggedInUsername);
		setShowLoginModal(false);
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
		setUsername('');
	};

	return (
		<header className={isLandingPage ? 'landing-header' : ''}>
			<Link to="/" id="logo">당근마차</Link>
			<Link to="/guide">이용가이드</Link>
			{isLoggedIn ? (
				<>
					<span className={isLandingPage ? 'landing-text' : ''}>안녕하세요, {username}님!</span>
					<button className={isLandingPage ? 'landing-button' : ''} onClick={() => setShowProfileNavbar(!showProfileNavbar)}>프로필</button>
					<button className={isLandingPage ? 'landing-button' : ''} onClick={handleLogout}>로그아웃</button>
				</>
			) : (
				<>
					<button className={isLandingPage ? 'landing-button' : ''} onClick={() => setShowLoginModal(true)}>로그인</button>
					<button className={isLandingPage ? 'landing-button' : ''} onClick={() => setShowSignupModal(true)}>회원가입</button>
				</>
			)}

			{showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}
			{showSignupModal && <SignupModal onClose={() => setShowSignupModal(false)} />}
			{showProfileNavbar && <ProfileNavbar onClose={() => setShowProfileNavbar(false)} />}
		</header>
	);
};
