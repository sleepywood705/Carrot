import './Landing.css'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function Landing() {
	const [texts, setTexts] = useState(['', '', '']);
	const [isTypingComplete, setIsTypingComplete] = useState([false, false, false]);
	const fullTexts = [
		'오늘도 내 앞을 지나는 택시와 만원 버스, 지하철',
		'우리는 언제쯤 목적지에 도착할 수 있을까요?',
		'서로 바빠 보이는데 같이 타고 갈 수는 없는 걸까요 ?|이럴 땐 하늘에서 차가 뚝 떨어졌으면 좋겠다니까요 🥲'
	];

	const typeText = (index, speed = 50) => {
		if (isTypingComplete[index]) return;

		let textIndex = 0;
		const timer = setInterval(() => {
			if (textIndex < fullTexts[index].length) {
				setTexts(prev => {
					const newTexts = [...prev];
					newTexts[index] = fullTexts[index].slice(0, textIndex + 1);
					return newTexts;
				});
				textIndex++;
			} else {
				clearInterval(timer);
				setIsTypingComplete(prev => {
					const newComplete = [...prev];
					newComplete[index] = true;
					return newComplete;
				});
			}
		}, speed);

		return () => clearInterval(timer);
	};

	useEffect(() => {
		const cleanup1 = typeText(0);
		const cleanup2 = typeText(1);
		const cleanup3 = typeText(2);

		return () => {
			cleanup1();
			cleanup2();
			cleanup3();
		};
	}, []);

	return (
		<div id="Landing">
			<section className="sect1">
				<video autoPlay muted loop>
					<source src="/vid/vid.mp4" />
				</video>
				<p>더 <span>스마트</span>한 이동</p>
				<p><span>당근마차</span>에서 시작됩니다</p>
				<Link to="/main" className="btn-trial">체험해보기</Link>
			</section>
			<section className="sect2"></section>
			<section className="sect3"></section>
			<section className="sect4">
				<p className={`typing-text ${isTypingComplete[0] ? 'completed' : ''}`}>{texts[0]}</p>
			</section>
			<section className="sect5">
				<p className={`typing-text ${isTypingComplete[1] ? 'completed' : ''}`}>{texts[1]}</p>
			</section>
			<section className="sect6">
				<p className={`typing-text ${isTypingComplete[2] ? 'completed' : ''}`}>
					{texts[2].split('|').map((line, index) => (
						<span key={index} className="line">{line}</span>
					))}
				</p>
			</section>
      <section className="sect7">
        <p>그런 여러분들을 위해서 <span>당근</span>이 <span>마차</span>를 준비했습니다 😉</p>
      </section>
		</div>
	);
}