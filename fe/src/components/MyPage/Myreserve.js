import React, { useState, useEffect } from 'react';
import axios from '../../api/axios.js';
import { Editor } from "../Editor.js";

export function MyReserve() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchUserIdAndReservations();
  }, []);

  const fetchUserIdAndReservations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      
      // 사용자 ID 가져오기
      const userResponse = await axios.get('/users/me', {
        headers: { 'Authorization': `${token}` }
      });
      const currentUserId = userResponse.data.data.id;
      setUserId(currentUserId);

      // 예약 정보 가져오기
      const reserveResponse = await axios.get('/posts/gets', {
        headers: { 'Authorization': `${token}` }
      });

      // 사용자의 예약만 필터링
      const userReservations = reserveResponse.data.data.filter(post => 
        post.reservations.some(reservation => reservation.bookerId === currentUserId)
      );

      setReservations(userReservations);
    } catch (error) {
      console.error('정보를 가져오는 데 실패했습니다:', error);
      setError('정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPost(null);
    fetchUserIdAndReservations(); // 모달이 닫힐 때 예약 목록 새로고침
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div id="MyReserve">
      <h2>내 예약 목록</h2>
      {reservations.length === 0 ? (
        <p>예약된 내역이 없습니다.</p>
      ) : (
        <div className="Board">
          {reservations.map((post) => (
            <ReservationCard 
              key={post.id} 
              post={post} 
              onEditClick={() => handleEditClick(post)}
            />
          ))}
        </div>
      )}
      <Editor
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editData={selectedPost}
        refreshPosts={fetchUserIdAndReservations}
        postId={selectedPost?.id}
        userReservation={selectedPost?.reservations[0]}
        userId={userId}
        isReservationEnded={selectedPost?.title.endsWith('[예약마감]')}
      />
    </div>
  );
}

function ReservationCard({ post, onEditClick }) {
  const titleParts = post.title.split(" ");
  const genderInfo = titleParts[6];
  const isSameGender = genderInfo === "동성";
  const getStatusText = (status) => {
    if (status === "PENDING") return "예약중";
    return status || "알 수 없음";
  };

  return (
    <div className="Card" onClick={() => onEditClick(post)}>
      <div className="row1">
        <div className="user-name">
          <span>{post.author?.name || "알 수 없음"}{" "}</span>
        </div>
        <div className="card-title">
          <div className="user-type">
            <span>{titleParts[3]}</span>
            ·
            <span style={{ color: isSameGender ? 'blue' : 'inherit' }}>
              {titleParts[3] === "택시" ? titleParts[6] : genderInfo}
            </span>
          </div>
          <div className={`switch ${isSameGender ? 'switch-on' : ''}`}>
            <div className="gear"></div>
          </div>
        </div>
      </div>
      <div className="row2">
        <div className="route">
          <p>출발지<span>{titleParts[0]}</span></p>
          <p>도착지<span>{titleParts[2]}</span></p>
        </div>
        <div className="date">
          <p>날짜<span>{titleParts[4]}{" "}</span></p>
          <p>출발<span>{titleParts[5]}</span></p>
        </div>
      </div>
      <div className="row3">
        <p>상태: <span>{getStatusText(post.reservations[0]?.status)}</span></p>
      </div>
    </div>
  );
}
