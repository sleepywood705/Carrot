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
            <button>로그인</button>
            <button>회원가입</button>
            <Link to="/trial">
                <div> 
                    <img src="/img/logo.svg" alt="logo" />
                    체험해보기
                </div>
            </Link>
        </header>
    );
};