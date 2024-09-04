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
        </div>
    );
}; 