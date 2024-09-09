import './Landing.css'
import { Link } from 'react-router-dom';


export function Landing({ isLoggedIn }) {
	return (
		<div id="Landing">
			<section className="sect1">
				<video autoPlay muted loop>
					<source src="/vid/vid.mp4" />
				</video>
				<p>더 <span>스마트</span>한 이동</p>
				<p><span>당근마차</span>에서 시작됩니다</p>
				{isLoggedIn && (
					<Link to="/main" className="btn-trial">체험해보기</Link>
				)}
			</section>
			<section className="sect2">
				<p>오늘도 나를 지나치는 <span>택시</span></p>
			</section>
			<section className="sect3">
				<p>
					서로 바빠 보이는데...<br />
					같이 타면 안 되나?
				</p>
			</section>
			<section className="sect4">
				<p>
					버스보다 빠르고<br />
					택시보다 저렴하게
				</p>
			</section>
			<section className="sect5">
				<div className="left">
					<span>헤맬 필요 없이 !</span>
					<p>내 주변에서<br />당근마차 찾기</p>
					<p>
						출퇴근 상관없이<br />
						24시간 매칭이 가능한<br />
						1회성 서비스를 제공하는<br />
						클린하고 유용한 당근마차<br />
						지금 내 주변 지도를 확인해 보세요!
					</p>
				</div>
				<div className="right">
					<img src="/img/mockup.png" alt="mockup" />
					<img src="/img/mockup.png" alt="mockup" />
				</div>
			</section>
			<section className="sect6">
				<div className="left">
					<img src="/img/mockup.png" alt="mockup" />
					<img src="/img/mockup.png" alt="mockup" />
				</div>
				<div className="right">
					<span>빠르게 접선 !</span>
					<p>채팅으로<br />장소 정하기</p>
					<p>
						매칭이 완료되면<br />
						사전 채팅을 통해<br />
						만날 장소와 시간을<br />
						정확하게 공유할 수 있어요
					</p>
				</div>
			</section>
		</div>
	);
}