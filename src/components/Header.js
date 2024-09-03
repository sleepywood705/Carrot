import './Header.css'
import { Link } from 'react-router-dom';


export function Header() {
    return (
        <header>
            <Link to="/" id="logo">
                <img src="/img/logo.svg" alt="logo" />
                당근마차
            </Link>
            <Link to="/guide">이용가이드</Link>
            <Link to="/sign">로그인</Link>
            <Link to="/sign">회원가입</Link>
            <Link to="/trial">
                <div> 
                    <img src="/img/logo.svg" alt="logo" />
                    체험해보기
                </div>
            </Link>
        </header>
    );
};  