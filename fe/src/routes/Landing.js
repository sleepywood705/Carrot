import './Landing.css'
import { Link } from 'react-router-dom';


export function Landing() {
    return (
        <div id="Landing">
            <section className="sect1">
                <video autoPlay muted loop>
                    <source src="/vid/vid.mp4"/>
                </video>
                <p>더 <span>스마트</span>한 이동</p>
                <p><span>당근마차</span>에서 시작합니다</p>
                <Link to="/main">체험해보기</Link>
            </section>
            <section className="sect2">
                <p>오늘도 나를 지나치는 택시</p>
            </section>
            <section className="sect3">
                <p>서로 바빠 보이는데...</p>
                <p>같이 타면 안 되나?</p>
            </section>
            <section className="sect4">
                <p>버스보다 빠르고</p>
                <p>택시보다 저렴하게</p>
            </section>
        </div>
    );
}; 