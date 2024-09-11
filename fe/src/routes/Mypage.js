import "./Mypage.css";
import React, { useState, useEffect } from "react";
import axios from "../api/axios.js";

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
// function UserGrade({ grade, tripCount }) {
//   return (
//     <div className="user-grade">
//       <h2>회원 등급</h2>
//       <p>현재 등급: {grade}</p>
//       <p>총 여행 횟수: {tripCount}</p>
//     </div>
//   );
// }
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
// function PointInfo({ currentPoints, pointHistory }) {
//   return (
//     <div className="point-info">
//       <h2>포인트 정보</h2>
//       <p>현재 포인트: {currentPoints}</p>
//       <h3>포인트 내역</h3>
//       <ul>
//         {pointHistory.map((item, index) => (
//           <li key={index}>
//             {item.date}: {item.amount} 포인트 {item.type}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
function PointInfo({ point }) {
  return (
    <div className="point-info">
      <h2>포인트 정보</h2>
      <p>현재 포인트: {point}</p>
    </div>
  );
}


// 메인 마이페이지 컴포넌트
export function Mypage() {
  const [user, setUser] = useState(null);  // Store user data
  const [loading, setLoading] = useState(true);  // For loading state
  const [error, setError] = useState(null);  // For error handling

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');  // Get token from local storage if needed
        const response = await axios.get('/users/me', {
          headers: {
            Authorization: token  // Ensure token is sent
          }
        });
        // console.log(response.data.data)
        setUser(response.data.data);  // Set the fetched user data
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data available.</p>;

  return (
    <div className="carpool-mypage-container">
      <h1>마이 카풀</h1>
      <UserProfile user={user} />
      <UserGrade grade={user.grade || "일반"} tripCount={user.tripCount || 0} />
      {/* <UserGrade grade={user.grade} tripCount={user.tripCount} /> */}
      <PointInfo point={user.point} />
      {/* <PointInfo currentPoints={user.currentPoints} pointHistory={user.pointHistory} /> */}
    </div>
  );
}