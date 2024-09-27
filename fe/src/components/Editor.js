import "./Post.css";
import { Chat } from "./Chat/Chat";
import { useState, useEffect } from "react";
import Map from "../api/Map";
import axios from '../api/axios';

export function Editor({
  isOpen,
  onClose,
  onEdit,
  postId,
  onDelete,
  editData,
  refreshPosts,
  userReservation,
  isReservationLoading,
  userId,
  isReservationEnded,
}) {
  const [showChat, setShowChat] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [user, setUser] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && editData && editData.id) {
        setIsLoading(true);
        await fetchUserEmail();
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, editData]);

  useEffect(() => {
    if (isOpen && editData) {
      console.log('Editor - 받은 editData:', editData);
      console.log('Editor - 예약 마감 여부:', isReservationEnded);
    }
  }, [isOpen, editData, isReservationEnded]);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && editData && editData.id) {
        setIsLoading(true);
        await fetchUserEmail();
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, editData]);

  useEffect(() => {
    if (isOpen && editData) {
      console.log('Editor - 받은 editData:', editData);
      console.log('Editor - 예약 마감 여부:', isReservationEnded);
    }
  }, [isOpen, editData, isReservationEnded]);

  const fetchUserEmail = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('/users/me', {
        headers: {
          Authorization: token,
        },
      });
      const email = response.data.data.email;
      setUserEmail(email);
      setUser(response.data.data);
    } catch (error) {
      console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
    }
  };

  const handleMapSubmit = (data) => {
    setMapData(data);
  };

  if (!isOpen) return null;

  const titleParts = editData.title.split(" ");
  const initialDeparture = titleParts[0];
  const initialArrival = titleParts[2];

  const authorEmail = editData.author.email;

  const isSameUser = userEmail === authorEmail;

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

      if (response.status) {
        onClose();
        refreshPosts();
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

      if (response.status) {
        onClose();
        refreshPosts();
        console.log('삭제된 게시물 ID:', editData.id);
      }
    } catch (error) {
      console.error('게시물 삭제 중 오류 발생:', error);
      alert('게시물을 삭제하는 데 실패했습니다.');
    }
  };

  const handleReserve = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해 주세요.');
      }

      const reserveData = {
        from: formData.departure,
        to: formData.arrival,
        date: `${formData.date}T${formData.time}:00.000Z`,
        postId: editData.id,
        bookerId: userId,
      };

      console.log('예약 데이터 (서버로 전송 전):', reserveData);

      const response = await axios.post('/reserve/reserve', reserveData, {
        headers: { 'Authorization': `${token}` }
      });

      if (response.status === 201) {
        console.log('예약 성공:', response.data);
        alert('예약이 완료되었습니다.');
        onClose();
        refreshPosts();
      }
    } catch (error) {
      console.error('예약 중 오류 발생:', error);
      alert('예약에 실패했습니다.');
    }
  };

  const handleCancelReservation = async () => {
    const token = localStorage.getItem('token');
    if (!token || !userReservation) {
      console.log('토큰이 없거나 예약 정보가 없습니다.');
      return;
    }

    try {
      // 먼저 예약 정보를 조회합니다.
      const checkResponse = await axios.get(`/reserve/get/${userReservation.id}`, {
        headers: { 'Authorization': `${token}` }
      });

      console.log('Reservation check response:', checkResponse.data);

      // 예약이 존재하면 삭제를 진행합니다.
      const cancelResponse = await axios.delete(`/reserve/delete/${userReservation.id}`, {
        headers: { 'Authorization': `${token}` }
      });

      if (cancelResponse.status) {
        console.log('예약 취소 성공:', cancelResponse.data);
        alert('예약이 취소되었습니다.');
        onClose();
        refreshPosts();
      }
    } catch (error) {
      console.error('예약 취소 중 오류 발생:', error);
      if (error.response) {
        console.log('에러 응답:', error.response.data);
        console.log('에러 상태:', error.response.status);
        console.log('에러 헤더:', error.response.headers);
      }
      alert('예약 취소에 실패했습니다. 예약이 이미 취소되었거나 존재하지 않을 수 있습니다.');
    }
  };

  return (
    <div id="Editing">
      {!isLoading && !isReservationLoading && (
        <>
          <Map
            onMapSubmit={handleMapSubmit}
            initialDeparture={initialDeparture}
            initialArrival={initialArrival}
          />
          <PostingForm
            isOpen={isOpen}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={onClose}
            editData={editData}
            userEmail={userEmail}
            mapData={mapData}
            initialDeparture={initialDeparture}
            initialArrival={initialArrival}
            isSameUser={isSameUser}
            setShowChat={setShowChat}
            userReservation={userReservation}
            onReserve={handleReserve}
            onCancelReservation={handleCancelReservation}
            user={user}
            userId={userId}
            refreshPosts={refreshPosts}
            isReservationEnded={isReservationEnded}
          />
          {showChat && <Chat postId={postId} user={user} messageList={messageList} setMessageList={setMessageList} />}
        </>
      )}
    </div>
  );
}

function PostingForm({
  isOpen,
  onEdit,
  onDelete,
  onClose,
  editData,
  userEmail,
  initialDeparture,
  initialArrival,
  isSameUser,
  setShowChat,
  userReservation,
  onReserve,
  onCancelReservation,
  user,
  userId,
  refreshPosts,
  isReservationEnded,
}) {
  const [type, setType] = useState("탑승자");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [departure, setDeparture] = useState(initialDeparture);
  const [arrival, setArrival] = useState(initialArrival);
  const [gender, setGender] = useState("성별무관");
  const [taxiCapacity, setTaxiCapacity] = useState("2");
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    if (editData) {
      const titleParts = editData.title.split(" ");
      setType(titleParts[3] || "");
      setTime(titleParts[5] || "");
      setDate(titleParts[4] || "");
      setGender(editData.gender || "성별무관");
    }
  }, [editData]);

  useEffect(() => {
    console.log('PostingForm - 예약 마감 여부:', isReservationEnded);
  }, [isReservationEnded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const editedTrip = {
      title: `${departure} -> ${arrival} ${type} ${date} ${time} ${type === "택시" ? `${taxiCapacity}인` : gender}`,
    };
    console.log('수정된 데이터 (서버로 전송 전):', editedTrip);
    onEdit(editedTrip);
  };

  const handleCloseModal = () => {
    onClose();
  }

  if (!isOpen) return null;

  const isReservationOwner = userReservation && userId && userReservation.bookerId === userId;

  const handleReservationComplete = async () => {
    const isConfirmed = window.confirm("예약을 마감하시겠습니까?");
    if (isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('인증 토큰이 없습니다. 다시 로그인해 주세요.');
        }

        // 기존 제목에 "[예약마감]" 문구를 추가합니다.
        const updatedTitle = `${editData.title} [예약마감]`;
        console.log(updatedTitle);
        const response = await axios.patch(`/posts/patch/${editData.id}`,
          { title: updatedTitle },
          { headers: { 'Authorization': `${token}` } }
        );

        if (response.status === 200) {
          alert("예약이 마감되었습니다.");
          refreshPosts(); // 메인 화면 새로고침
          onClose(); // 모달 닫기
        }
      } catch (error) {
        console.error('예약 마감 처리 중 오류 발생:', error);
        alert('예약 마감 처리에 실패했습니다.');
      }
    }
  };

  const handleReserveClick = () => {
    if (isReservationOwner) {
      onCancelReservation();
    } else {
      const formData = {
        departure,
        arrival,
        date,
        time,
        type,
        gender: type === "택시" ? `${taxiCapacity}인` : gender,
      };
      onReserve(formData);
    }
  };

  const handlePayment = () => {
    alert(`${paymentAmount}원 결제가 완료되었습니다.`);
  };

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
      {type === '택시' && (
        <div className="a">
          <h2>몇 명이 탑승하나요?</h2>
          <select
            value={taxiCapacity}
            onChange={(e) => setTaxiCapacity(Number(e.target.value))}
            disabled={!isSameUser}
          >
            <option value={2}>2인</option>
            <option value={3}>3인</option>
            <option value={4}>4인</option>
          </select>
        </div>
      )}
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
      {type !== '택시' && (
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
      )}

      {!isSameUser && (
        <div className="payment-section">
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="결제 금액 입력"
          />
          <button type="button" onClick={handlePayment}>결제하기</button>
        </div>
      )}



      <div className="cont_btn">
        {isSameUser ? (
          <>
            <div className="button-r">
              <button type="button" onClick={handleReservationComplete} className="full-width">
                {isReservationEnded ? "예약 완료" : "예약 마감"}
              </button>
              <button type="button" onClick={() => setShowChat(true)} className="full-width">채팅하기</button>
              <div className="button-row">
                <button type="submit" className="half-width">수정하기</button>
                <button type="button" onClick={onDelete} className="half-width">삭제하기</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="button-r">
              <button
                type="button"
                onClick={handleReserveClick}
                disabled={isReservationEnded || editData.isReservationCompleted}
                className="full-width"
              >
                {isReservationEnded ? "예약이 마감되었습니다" :
                  (isReservationOwner ? "예약 취소하기" : "예약하기")}
              </button>
              <button type="button" onClick={() => setShowChat(true)} className="full-width">채팅하기</button>
              <button type="button" onClick={handleCloseModal} className="full-width">취소하기</button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
