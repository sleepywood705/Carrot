import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import { Editor } from "../Editor.js";

export function MyReserve({ user }) {
  const [myReservations, setMyReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchMyReservations();
  }, [user]);

  const fetchMyReservations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/reserve/gets", {
        headers: { Authorization: token },
      });

      if (response.data && Array.isArray(response.data.data)) {
        const filteredReservations = response.data.data.filter((reservation) => reservation.bookerId === user.id);
        console.log("Filtered Reservations:", filteredReservations);
        setMyReservations(filteredReservations);
      } else {
        throw new Error("서버에서 받은 데이터 구조가 예상과 다릅니다.");
      }
    } catch (error) {
      console.error("내 예약을 가져오는 데 실패했습니다:", error);
      setError(error.message || "데이터를 불러오는 데 실패했습니다.");
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
    fetchMyReservations();
  };

  return (
    <div id="MyReserve">
      <h2>내가 예약한 글</h2>
      {isLoading && <p>로딩 중...</p>}
      {error && <p>{error}</p>}
      {myReservations.length === 0 && !isLoading && !error && (
        <div><p>예약한 글이 없습니다</p></div>
      )}
      <div className="Board">
        {myReservations.map((reservation) => {
          const post = reservation.post;
          const titleParts = post.title.split(" ");
          const isReservationClosed = post.title.endsWith('[예약마감]');
          const genderInfo = titleParts[6];
          const isSameGender = genderInfo === "동성";

          return (
            <div key={reservation.id} className="Card" onClick={() => handleEditClick(post)}>
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
                  <p>출발지<span>{reservation.from}</span></p>
                  <p>도착지<span>{reservation.to}</span></p>
                </div>
                <div className="date">
                  <p>날짜<span>{new Date(reservation.date).toLocaleDateString()}</span></p>
                  <p>출발<span>{new Date(reservation.date).toLocaleTimeString()}</span></p>
                </div>
              </div>
              <div className={`row3 ${isReservationClosed ? 'booking-finished' : 'booking'}`}>
                {isReservationClosed ? "예약 마감" : "예약됨"}
              </div>
              <div className="Cover">
                {isReservationClosed && <img src="/img/finish.png" alt="예약 마감" />}
              </div>
            </div>
          );
        })}
      </div>
      <Editor
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editData={selectedPost}
        refreshPosts={fetchMyReservations}
        postId={selectedPost?.id}
        userReservation={null} // MyPost에서는 사용자의 예약 정보가 필요 없을 수 있습니다.
        userId={user.id}
        isReservationEnded={selectedPost?.title.endsWith('[예약마감]')}
      />
    </div>
  );
}