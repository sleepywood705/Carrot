import React, { useState } from "react";
import "./Mypage2.css";

export function Mypage2() {
  const [selectedMenu, setSelectedMenu] = useState(null);

  const renderContent = () => {
    switch (selectedMenu) {
      case "changeInfo":
        return <ChangeInfo />;
      case "myPoint":
        return <MyPoint />;
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
        <div className="nickname">닉네임</div>
      </div>
      <div className="bot">
        <div id="SNB">
          <details>
            <summary>내 정보 관리</summary>
            <ul>
              <li onClick={() => setSelectedMenu("changeInfo")}>회원정보변경</li>
              <li onClick={() => setSelectedMenu("myPoint")}>내 포인트</li>
              <li onClick={() => setSelectedMenu("withdrawal")}>회원 탈퇴</li>
            </ul>
          </details>
          <details>
            <summary>이용 관리</summary>
            <ul>
                <li>이용기록</li>
            </ul>
          </details>
        </div>
        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function ChangeInfo() {
  return (
    <div id="ChangeInfo">
      <h2>회원정보변경</h2>
      <form>
        <div>
          <label>닉네임</label>
          <input type="text" />
        </div>
        <div>
          <label>이름</label>
          <input type="text" />
        </div>
        <div>
          <label>이메일</label>
          <input type="mail" />
        </div>
        <div>
          <label>비밀번호</label>
          <input type="password" />
        </div>
        <div>
          <label>비밀번호 확인</label>
          <input type="password" />
        </div>
        <div className="wrap">
          <button className="btn_cancel">취소</button>
          <button className="btn_change">변경</button>
        </div>
      </form>
    </div>
  );
}


function MyPoint() {
    return (
        <div id="MyPoint">
            <h2>내 포인트</h2>
            <div className="currentPoint">1500 포인트</div>
            <h3>포인트 내역</h3>
            <ul>
                <li className="pointList">2024-09-10 100포인트 적립</li>
                <li className="pointList">2024-09-10 100포인트 적립</li>
                <li className="pointList">2024-09-10 100포인트 적립</li>
                <li className="pointList">2024-09-10 100포인트 적립</li>
            </ul>
        </div>
    )
}


function Withdrawal() {
    return (
        <div id="Withdrawal">
            <h2>회원탈퇴</h2>
            <div>
                <p>앗, 정말 탈퇴하시겠어요?<br/>출퇴근길이 힘들어질지도 몰라요😥</p>
            </div>
            <div className="wrap">
                <button className="btn_cancel">취소</button>
                <button className="btn_confirm">탈퇴</button>
           </div>
        </div>
    )
}