import "./Poster.css";
import { Chat } from "./Chat/Chat";
import { useState, useEffect } from "react";
import { EditorForm } from "./EditorForm";
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
    const handleKeyDown = (event) => {
      if (event.key === "Escape") { onClose(); }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

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
    <div id="Editor">
      {!isLoading && !isReservationLoading && (
        <>
          <Map
            onMapSubmit={handleMapSubmit}
            initialDeparture={initialDeparture}
            initialArrival={initialArrival}
          />
          <EditorForm
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

