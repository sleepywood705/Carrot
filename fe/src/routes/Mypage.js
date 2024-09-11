import "./Mypage.css";
import axios from '../api/axios.js'

// 사용자 프로필 컴포넌트
function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <h2>사용자 정보</h2>
      <div className="user-profile-content">
        <div className="user-info">
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <p>전화번호: {user.phone}</p>
        </div>
        <div className="user-image">
          <img src="./img/1.png" alt="프로필 사진" className="profile-image" />
        </div>
      </div>
    </div>
  );
}

// 사용자 등급 컴포넌트
function UserGrade({ grade, tripCount }) {
  return (
    <div className="user-grade">
      <h2>회원 등급</h2>
      <p>현재 등급: {grade}</p>
      <p>총 여행 횟수: {tripCount}</p>
    </div>
  );
}

// 포인트 정보 컴포넌트
function PointInfo({ currentPoints, pointHistory }) {
  return (
    <div className="point-info">
      <h2>포인트 정보</h2>
      <p>현재 포인트: {currentPoints}</p>
      <h3>포인트 내역</h3>
      <ul>
        {pointHistory.map((item, index) => (
          <li key={index}>
            {item.date}: {item.amount} 포인트 {item.type}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 메인 마이페이지 컴포넌트
export function Mypage() {



  // 임의의 사용자 정보
  const user = {
    name: "김카풀",
    email: "kimcarpool@example.com",
    phone: "010-1234-5678",
    profileImage: "https://example.com/profile.jpg",
    grade: "골드",
    tripCount: 50,
    currentPoints: 1500,
    pointHistory: [
      { date: "2023-04-15", amount: 100, type: "적립" },
      { date: "2023-04-10", amount: 50, type: "사용" },
      { date: "2023-04-05", amount: 200, type: "적립" },
    ]
  };



  return (
    <div className="carpool-mypage-container">
      <h1>마이 카풀</h1>
      <UserProfile user={user} />
      <UserGrade grade={user.grade} tripCount={user.tripCount} />
      <PointInfo currentPoints={user.currentPoints} pointHistory={user.pointHistory} />
    </div>
  );
}