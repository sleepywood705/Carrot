import "./Mypage2.css";
import React, { useState, useEffect } from "react";
import axios from "../api/axios.js";


export function Mypage2() {
  const [user, setUser] = useState(null);  // Store user data
  const [loading, setLoading] = useState(true);  // For loading state
  const [error, setError] = useState(null);  // For error handling
  const [selectedMenu, setSelectedMenu] = useState("changeInfo");

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


  const renderContent = () => {
    switch (selectedMenu) {
      case "changeInfo":
        return <ChangeInfo user={user} />;
      case "myPoint":
        return <MyPoint point={user.point} />;
      case "withdrawal":
        return <Withdrawal />;
      default:
        return null;
    }
  };

  return (
    <div id="Mypage2">
      <div className="top">
        <div className="cnt_img">
          <img src="/img/leaf.png" alt="leaf" />
          <div className="img_profile"></div>
        </div>
        <div className="nickname">{user.name}</div>
      </div>
      <div className="bot">
        <div id="SNB">
          <details open>
            <summary>내 정보 관리</summary>
            <ul>
              <li onClick={() => setSelectedMenu("changeInfo")}>회원정보변경</li>
              <li onClick={() => setSelectedMenu("myPoint")}>내 포인트</li>
              <li onClick={() => setSelectedMenu("withdrawal")}>회원 탈퇴</li>
            </ul>
          </details>
          <details open>
            <summary>이용 관리</summary>
            <ul>
              <li>이용 기록</li>
            </ul>
          </details>
        </div>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}

function ChangeInfo({ user }) {
  return (
    <div id="ChangeInfo">
      <h2>회원정보변경</h2>
      <div className="userInfo">
        <div>
          <span>닉네임</span>
          <div>{user.nickname}</div>
        </div>
        <div>
          <span>이름</span>
          <div>{user.name}</div>
        </div>
        <div>
          <span>성별</span>
          <div>{user.gender}</div>
        </div>
        <div>
          <span>이메일</span>
          <div>{user.email}</div>
        </div>
        <div>
          <span>비밀번호</span>
          <input placeholder="******"/>
        </div>
        <div>
          <span>비밀번호 확인</span>
          <input placeholder="******"/>
        </div>
        <button className="btn_change">변경</button>
      </div>
    </div>
  );
}

function MyPoint({ point }) {
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

function Withdrawal() {
  return (
    <div id="Withdrawal">
      <h2>회원탈퇴</h2>
      <div>
        <p>
          앗, 정말 탈퇴하시겠어요?
          <br />
          출퇴근길이 힘들어질지도 몰라요😥
        </p>
      </div>
      <div className="wrap">
        <button className="btn_confirm">탈퇴</button>
      </div>
    </div>
  );
}