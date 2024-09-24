export function MyPoint({ point }) {
    return (
      <div id="MyPoint">
        <h2>내 포인트</h2>
        <div className="currentPoint">{point}</div>
        <h3>포인트 내역</h3>
        <ul>
          <li className="pointList">2024-09-10 100포인트 적립</li>
          <li className="pointList">2024-09-10 100포인트 적립</li>
        </ul>
      </div>
    );
  }