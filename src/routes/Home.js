import './Home.css'
import { Link } from 'react-router-dom';


export function Home() {
    return (
        <div id="Home">
            <section className="sect1">
                <video autoPlay muted loop>
                    <source src="/vid/mainmv.mp4"/>
                </video>
                <p>더 <span>스마트</span>한 이동</p>
                <p>
                    <span>
                        <img src="/img/logo.svg" alt="logo" />
                        당근마차
                    </span>
                    에서 시작합니다
                </p>
                <Link to="/main">체험해보기</Link>
            </section>
            <section className="sect2">
                <p>오늘도 내 앞을 지나는 택시</p>
                <img src="/img/taxi.jpg" alt="taxi"/>
                <img src="/img/taxi.jpg" alt="taxi"/>
            </section>
            <section className="sect3">
                <img src="/img/bubble.png" alt="bubble" />
                <img src="/img/bubble.png" alt="bubble" />
                <img src="/img/bubble2.png" alt="bubble" />
                <img src="/img/bubble2.png" alt="bubble" />
                <img src="/img/bubble2.png" alt="bubble" />
                <img src="/img/bubble.png" alt="bubble" />
            </section>
        </div>
    );
}; 