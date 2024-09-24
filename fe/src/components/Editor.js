import "./Post.css";
import { Chat } from "./Chat";
import { useState, useEffect } from "react";
import Map from "../api/Map"; // Map 컴포넌트 가져오기
import axios from '../api/axios'; // axios 가져오기

export function Editor({
  isOpen,
  onClose,
  onEdit,
  onReserve,
  onDelete,
  editData,
  refreshPosts, // Main 컴포넌트에서 posts를 새로고침하는 함수
}) {
  const [showChat, setShowChat] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // 사용자 이메일 상태 추가
  const [user, setUser] = useState(null); // 사용자 상태 추가
  const [messageList, setMessageList] = useState([]);
  const [mapData, setMapData] = useState(null); // Map 데이터 상태 추가

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") { onClose(); }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      fetchUserEmail(); // 이메일 가져오기
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const fetchUserEmail = async () => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기

    try {
      const response = await axios.get('/users/me', {
        headers: {
          Authorization: token,  
        },
      });
      console.log('사용자 정보:', response.data);
      const email = response.data.data.email; // 이메일 가져오기
      setUserEmail(email); // 상태에 이메일 저장
      setUser(response.data); // 사용자 정보 저장
      console.log('현재 사용자 이메일:', email); // 콘솔에 이메일 출력
    } catch (error) {
      console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
    }
  };

  const handleMapSubmit = (data) => {
    console.log('Map data received:', data);
    setMapData(data); // Map 데이터 설정
  };

  if (!isOpen) return null;

  // title을 쪼개서 출발지와 도착지 설정
  const titleParts = editData.title.split(" ");
  const initialDeparture = titleParts[0]; // 출발지
  const initialArrival = titleParts[2]; // 도착지

  // 작성자 이메일 가져오기
  const authorEmail = editData.author.email; // 작성자 이메일

  // 이메일 비교
  const isSameUser = userEmail === authorEmail; // 이메일 비교 결과

  // 콘솔에 결과 출력
  console.log('현재 사용자 이메일:', userEmail);
  console.log('작성자 이메일:', authorEmail);
  console.log('사용자는 작성자와 동일한가?', isSameUser);

  const handleEdit = async (editedTrip) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해 주세요.');
      }

      console.log('서버로 전송되는 데이터:', editedTrip);

      const response = await axios.patch(`/posts/patch/${editData.id}`, editedTrip, {
        headers: { 'Authorization': `${token}` }
      });

      if (response.status === 200) {
        onClose();
        refreshPosts(); // Main 컴포넌트의 posts 상태를 새로고침
        console.log('서버 응답:', response.data);
      }
    } catch (error) {
      console.error('게시물 수정 중 오류 발생:', error);
      alert('게시물을 수정하는 데 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해 주세요.');
      }

      const response = await axios.delete(`/posts/delete/${editData.id}`, {
        headers: { 'Authorization': `${token}` }
      });

      if (response.status === 200) {
        onClose();
        refreshPosts(); // Main 컴포넌트의 posts 상태를 새로고침
        console.log('삭제된 게시물 ID:', editData.id); // 삭제된 게시물 ID를 콘솔에 출력
      }
    } catch (error) {
      console.error('게시물 삭제 중 오류 발생:', error);
      alert('게시물을 삭제하는 데 실패했습니다.');
    }
  };

  return (
    <div id="Post">
      <Map 
        onMapSubmit={handleMapSubmit} 
        initialDeparture={initialDeparture} // 출발지 초기값
        initialArrival={initialArrival} // 도착지 초기값
      /> {/* Map 컴포넌트 추가 */}
      <PostingForm
        isOpen={isOpen}
        onEdit={handleEdit} // handleEdit 함수로 변경
        onDelete={handleDelete} // handleDelete 함수로 변경
        onClose={onClose}
        onReserve={() => setShowChat(true)}
        editData={editData}
        userEmail={userEmail} // 사용자 이메일 전달
        mapData={mapData} // Map 데이터 전달
        initialDeparture={initialDeparture} // 출발지 초기값 전달
        initialArrival={initialArrival} // 도착지 초기값 전달
        isSameUser={isSameUser} // 이메일 비교 결과 전달
      />
      {showChat && <Chat user={user} messageList={messageList} setMessageList={setMessageList} />}
    </div>
  );
}

function PostingForm({
  isOpen,
  onEdit,
  onDelete,
  onClose,
  onReserve,
  editData,
  userEmail,
  initialDeparture,
  initialArrival,
  isSameUser,
}) {
  const [type, setType] = useState("탑승자");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [departure, setDeparture] = useState(initialDeparture);
  const [arrival, setArrival] = useState(initialArrival);
  const [gender, setGender] = useState("성별무관"); // gender 상태 추가

  useEffect(() => {
    if (editData) {
      const titleParts = editData.title.split(" ");
      setType(titleParts[3] || "");
      setTime(titleParts[5] || "");
      setDate(titleParts[4] || "");
      setDeparture(titleParts[0] || "");
      setArrival(titleParts[2] || "");
      setGender(titleParts[6] || "성별무관"); // gender 설정 추가
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const editedTrip = {
      title: `${departure} -> ${arrival} ${type} ${date} ${time} ${gender}`,
    };
    console.log('수정된 데이터 (서버로 전송 전):', editedTrip);
    onEdit(editedTrip);
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleReserve = () => {
    if (onReserve) {
      onReserve(editData);
    }
  };

  const handleCloseModal = () => {
    onClose();
  }

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="PostingForm">
      <div className="a">
        <h2>유형을 선택해 주세요<button onClick={handleCloseModal}></button></h2>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          disabled={!isSameUser}
        >
          <option value="탑승자">탑승자</option>
          <option value="운전자">운전자</option>
          <option value="택시">택시</option>
        </select>
      </div>
      <div className="a">
        <h2>몇 시에 출발하시나요?</h2>
        <input
          type="time"
          className="cnt_time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          disabled={!isSameUser}
        />
      </div>
      <div className="a">
        <h2>언제 출발하시나요?</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={!isSameUser}
        />
      </div>
      <div className="a">
        <h2>어떤 분과 탑승하시나요?</h2>
        <div className="wrap">
          <label>
            <input
              type="radio"
              id="anyone"
              name="gender"
              value="성별무관"
              checked={gender === "성별무관"}
              onChange={(e) => setGender(e.target.value)}
              disabled={!isSameUser}
            />
            성별무관
          </label>
          <label>
            <input
              type="radio"
              id="same"
              name="gender"
              value="동성"
              checked={gender === "동성"}
              onChange={(e) => setGender(e.target.value)}
              disabled={!isSameUser}
            />
            동성
          </label>
        </div>
      </div>
      <div className="cont_btn">
        {isSameUser ? (
          <button type="submit">수정하기</button>
        ) : (
          <button type="button" onClick={handleReserve}>예약하기</button>
        )}
        <button type="button" onClick={handleReserve}>채팅하기</button>
        {isSameUser ? (
          <button type="button" onClick={handleDelete}>삭제하기</button>
        ) : (
          <button type="button" onClick={handleCloseModal}>취소하기</button>
        )}
      
      </div>
      
    </form>
  );
}
