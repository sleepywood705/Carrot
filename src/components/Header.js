import './Header.css'
import { Link } from 'react-router-dom';

export function Header({ isScrolled }) {
    return (
        <header className={isScrolled ? 'scrolled' : ''}>
            <Link to="/" id="logo">당근마차</Link>
            <Link to="/guide">이용가이드</Link>
            <Link to="/sign">로그인</Link>
            <Link to="/sign">회원가입</Link>
            <button>작성하기</button>
        </header>
    );
};
