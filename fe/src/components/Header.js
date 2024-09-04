import React, { useState, useEffect } from 'react';
import './Header.css'
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import ProfileNavbar from './ProfileNavbar';

export function Header() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showProfileNavbar, setShowProfileNavbar] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    
    const handleLogin = (loggedInUsername) => {
        setIsLoggedIn(true);
        setUsername(loggedInUsername);
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
    };

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 200) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <header className={isScrolled ? 'scrolled' : ''}>
            <Link to="/" id="logo">당근마차</Link>
            <Link to="/guide">이용가이드</Link>
            {isLoggedIn ? (
                <>
                    <span>안녕하세요, {username}님!</span>
                    <button onClick={() => setShowProfileNavbar(!showProfileNavbar)}>프로필</button>
                    <button onClick={handleLogout}>로그아웃</button>
                </>
            ) : (
                <>
                    <button onClick={() => setShowLoginModal(true)}>로그인</button>
                    <button onClick={() => setShowSignupModal(true)}>회원가입</button>
                </>
            )}
            
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}
            {showSignupModal && <SignupModal onClose={() => setShowSignupModal(false)} />}
            {showProfileNavbar && <ProfileNavbar onClose={() => setShowProfileNavbar(false)} />}
        </header>
    );
};

export default Header;