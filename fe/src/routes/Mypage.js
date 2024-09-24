import "./MyPage.css";
import { ChangeInfo } from "../components/MyPage/ChangeInfo.js";
import { MyPoint } from "../components/MyPage/MyPoint.js"; 
import { Withdrawal } from "../components/MyPage/Withdrawal.js";
import { MyHistory } from "../components/MyPage/MyHistory.js";
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
      case "Myhistory":
        return <MyHistory />;
      default:
        return null;
    }
  };

  return (
    <div id="MyPage">
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
      </div>
      <div className="right">{renderContent()}</div>
    </div>
  );
}









function MyPost({ userId }) {
  const [userEmail, setUserEmail] = useState(null); // 사용자 이메일 상태 추가
  const [user, setUser] = useState(null); // 사용자 상태 추가
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/users/me", {
          headers: {
            Authorization: token,
          },
        });
        console.log(response.data.data.email);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserEmail();
  }, [userId]);

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/posts/gets');
        console.log('서버에서 받은 데이터:', response.data);
        
        if (response.data && Array.isArray(response.data.data)) {
          setTrips(response.data.data);
        } else {
          throw new Error('서버에서 받은 데이터 구조가 예상과 다릅니다.');
        }
      } catch (error) {        console.error('포스팅 데이터를 가져오는 데 실패했습니다:', error);
        setError(error.message || '데이터를 불러오는 데 실패했습니다.');

      } finally {
        setIsLoading(false);
      }
    };
  }, [userId]);

  return (
    <div id="MyPost">
      <h2>내가 작성한 글</h2>
      <div></div>
    </div>
  );
}