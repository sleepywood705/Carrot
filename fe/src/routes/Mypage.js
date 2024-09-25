import "./Mypage.css";
import { ChangeInfo } from "../components/MyPage/ChangeInfo.js";
import { MyPoint } from "../components/MyPage/MyPoint.js"; 
import { MyHistory } from "../components/MyPage/MyHistory.js";
import { MyPost } from "../components/MyPage/MyPost.js";
import { Withdrawal } from "../components/MyPage/Withdrawal.js";
import { License } from "../components/MyPage/License.js";
import { useState, useEffect } from "react";
import axios from "../api/axios.js";

export function Mypage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("MyPost");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/users/me", {
          headers: {
            Authorization: token,
          },
        });
        setUser(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data available.</p>;

  const getProfileImage = (gender) => {
    switch (gender) {
      case "MALE":
        return "url(/img/man.png)";
      case "FEMALE":
        return "url(/img/woman.png)";
      default:
        return "url(/img/default.png)";
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "ChangeInfo":
        return <ChangeInfo user={user} />;
      case "MyPoint":
        return <MyPoint point={user.point} />;
      case "MyPost":
        return <MyPost userId={user.id} />; // MyPost 컴포넌트에 userId 전달
      case "Withdrawal":
        return <Withdrawal />;
      case "MyHistory":
        return <MyHistory />;
      case "License":
          return <License />;
      default:
        return null;
    }
  };

  return (
    <div id="Mypage">
      <div id="SNB" className="left">
        <div className="profile">
          <div className="wrap_img">
            <img src="/img/leaf.png" alt="leaf" />
            <div
              className="img_profile"
              style={{
                background: `${getProfileImage(
                  user.gender
                )} center/cover no-repeat`,
              }}
            ></div>
          </div>
          <div className="username">{user.name}</div>
        </div>
        <details open>
          <summary>내 정보 관리</summary>
          <ul>
            <li onClick={() => setSelectedMenu("ChangeInfo")}>회원정보변경</li>
            <li onClick={() => setSelectedMenu("MyPoint")}>내 포인트</li>
            <li onClick={() => setSelectedMenu("MyPost")}>내가 작성한 글</li>
            <li onClick={() => setSelectedMenu("Withdrawal")}>회원 탈퇴</li>
          </ul>
        </details>
        <details open>
          <summary>이용 관리</summary>
          <ul>
            <li onClick={() => setSelectedMenu("MyHistory")}>이용 내역</li>
          </ul>
        </details>
        <details open>
          <summary>차량 등록</summary>
          <ul>
            <li onClick={() => setSelectedMenu("License")}>면허 인증</li>
          </ul>
        </details>
      </div>
      <div className="right">{renderContent()}</div>
    </div>
  );
}