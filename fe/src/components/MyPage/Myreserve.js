import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import { Editor } from "../Editor.js";

export function MyReserve({ user }) {
  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchMyPosts();
  }, [user]);

  const fetchMyPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/posts/gets", {
        headers: { Authorization: token },
      });

      if (response.data && Array.isArray(response.data.data)) {
        const filteredPosts = response.data.data.filter((post) => post.authorId === user.id);
        setMyPosts(filteredPosts);
      } else {
        throw new Error("서버에서 받은 데이터 구조가 예상과 다릅니다.");
      }
    } catch (error) {
      console.error("내 게시글을 가져오는 데 실패했습니다:", error);
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
    fetchMyPosts(); // 모달이 닫힐 때 목록 새로고침
  };

  return (
    <div id="MyReserve">
      <h2>내가 작성한 글</h2>
      {isLoading && <p>로딩 중...</p>}
      {error && <p>{error}</p>}
      {myPosts.length === 0 && !isLoading && !error && (
        <div><p>작성한 게시글이 없습니다</p></div>
      )}
      <div className="Board">
        {myPosts.map((post) => {
          const titleParts = post.title.split(" ");
          const reservationCount = post.reservations ? post.reservations.length : 0;
          const isReservationClosed = post.title.endsWith('[예약마감]');
          const genderInfo = titleParts[6];
          const isSameGender = genderInfo === "동성";

          return (
            <div key={post.id} className="Card" onClick={() => handleEditClick(post)}>
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
              {(isReservationClosed || reservationCount > 0) && (
                <div className={`row3 ${isReservationClosed ? 'booking' : 'booking-finished'}`}>
                  {isReservationClosed ? "예약 마감" : `${reservationCount}명 예약 중`}
                </div>
              )}
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
        refreshPosts={fetchMyPosts}
        postId={selectedPost?.id}
        userReservation={null} // MyPost에서는 사용자의 예약 정보가 필요 없을 수 있습니다.
        userId={user.id}
        isReservationEnded={selectedPost?.title.endsWith('[예약마감]')}
      />
    </div>
  );
}