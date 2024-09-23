import "./Mypage2.css";
import React, { useState, useEffect } from "react";
import axios from "../api/axios.js";


export function Mypage2() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("changeInfo");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/users/me', {
          headers: {
            Authorization: token
          }
        });
        setUser(response.data.data);
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
      case "myhistory":
        return <MyHistory />;
      default:
        return null;
    }
  };

  return (
    <div id="Mypage2">
      <div id="SNB" className="left">
        <div className="profile">
          <div className="wrap_img">
            <img src="/img/leaf.png" alt="leaf" />
            <div className="img_profile"></div>
          </div>
          <div className="username">{user.name}</div>
        </div>
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
              <li onClick={() => setSelectedMenu("myhistory")}>이용 내역</li>
            </ul>
        </details>
      </div>
      <div className="right">{renderContent()}</div>
    </div>
  );
}

function ChangeInfo({ user }) {
  const displayGender = (gender) => {
    switch(gender) {
      case 'MALE':
        return '남성';
      case 'WOMAN':
        return '여성';
      default:
        return gender;
    }
  };

  return (
    <div id="ChangeInfo">
      <h2>회원정보변경</h2>
      <div className="userInfo">
        <div>
          <span>이름</span>
          <div>{user.name}</div>
        </div>
        <div>
          <span>성별</span>
          <div>{displayGender(user.gender)}</div>
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


function MyHistory() {
  return (
    <div id="MyHistory">
      <h2>이용 내역</h2>
    </div>
  );
}
