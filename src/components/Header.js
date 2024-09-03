import './Header.css'
import { Link } from 'react-router-dom';


export function Header() {
    return (
        <header>
            <Link to="/" id="logo">
                <img src="/img/logo.svg" alt="logo" />
                당근마켓
            </Link>
            <Link to="/">회사소개</Link>
            <Link to="/">서비스 소개</Link>
            <Link to="/">이용가이드</Link>
            <Link to="/">자주 묻는 질문</Link>
            <Link to="/">
                <button>체험해보기</button>
            </Link>
        </header>
    );
};