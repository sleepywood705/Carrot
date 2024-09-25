import "./Main.css";
import { Post } from "../components/Post.js";
import { Editor } from "../components/Editor";
import { useState, useEffect } from "react";
import axios from "../api/axios.js";

export function Main() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [activeFilter, setActiveFilter] = useState("전체");
  const [searchParams, setSearchParams] = useState({
    departure: "",
    arrival: "",
    date: "",
  });
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchTrips();
    fetchUserEmail();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [trips, activeFilter, searchParams]);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/posts/gets');
      console.log('서버에서 받은 데이터:', response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setTrips(response.data.data);
      } else {
        throw new Error("서버에서 받은 데이터 구조가 예상과 다릅니다.");
      }
    } catch (error) {
      console.error("포스팅 데이터를 가져오는 데 실패했습니다:", error);
      setError(error.message || "데이터를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserEmail = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('/users/me', {
        headers: { 'Authorization': `${token}` }
      });
      setUserId(response.data.data.id);
      console.log('현재 로그인한 사용자의 이메일:', response.data.data.id);
    } catch (error) {
      console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
    }
  };

  const applyFiltersAndSearch = () => {
    let result = trips;

    // 검색 적용
    if (searchParams.departure || searchParams.arrival || searchParams.date) {
      result = result.filter((trip) => {
        const titleParts = trip.title.split(" ");
        const fromMatch = titleParts[0]
          .toLowerCase()
          .includes(searchParams.departure.toLowerCase());
        const toMatch = titleParts[2]
          .toLowerCase()
          .includes(searchParams.arrival.toLowerCase());
        const dateMatch =
          !searchParams.date || titleParts[4] === searchParams.date;
        return fromMatch && toMatch && dateMatch;
      });
    }

    // 필터 적용 (전체가 아닐 때만)
    if (activeFilter !== "전체") {
      result = result.filter(
        (trip) => trip.title.split(" ")[3] === activeFilter
      );
    }

    setFilteredTrips(result);
  };

  const searchTrips = (event) => {
    event.preventDefault();
    const newSearchParams = {
      departure: document.getElementById("departure").value,
      arrival: document.getElementById("arrival").value,
      date: document.getElementById("tripDate").value,
    };
    setSearchParams(newSearchParams);

    // 검색 후 필터링 적용
    let result = trips;
    if (
      newSearchParams.departure ||
      newSearchParams.arrival ||
      newSearchParams.date
    ) {
      result = result.filter((trip) => {
        const titleParts = trip.title.split(" ");
        const fromMatch = titleParts[0]
          .toLowerCase()
          .includes(newSearchParams.departure.toLowerCase());
        const toMatch = titleParts[2]
          .toLowerCase()
          .includes(newSearchParams.arrival.toLowerCase());
        const dateMatch =
          !newSearchParams.date || titleParts[4] === newSearchParams.date;
        return fromMatch && toMatch && dateMatch;
      });
    }

    // 현재 활성화된 필터 적용
    if (activeFilter !== "전체") {
      result = result.filter(
        (trip) => trip.title.split(" ")[3] === activeFilter
      );
    }

    setFilteredTrips(result);
  };

  const handleWriteSubmit = (newTrip) => {
    setTrips((prevTrips) => [newTrip, ...prevTrips]);
    fetchTrips(); // 게시물 추가 후 목록 새로고침
  };

  const handleEditClick = (trip) => {
    setSelectedTrip(trip);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTrip(null);
    fetchTrips(); // 모달이 닫힐 때 목록 새로고침
  };

  const filterTrips = (filterType) => {
    setActiveFilter(filterType);
    if (filterType === "전체") {
      // 전체를 선택하면 검색 조건도 초기화
      setSearchParams({ departure: "", arrival: "", date: "" });
      // 입력 필드 초기화
      document.getElementById("departure").value = "";
      document.getElementById("arrival").value = "";
      document.getElementById("tripDate").value = "";
      setFilteredTrips(trips); // 모든 여행을 표시
    } else {
      // 필터 적용
      const filtered = trips.filter(
        (trip) => trip.title.split(" ")[3] === filterType
      );
      setFilteredTrips(filtered);
    }
  };

  return (
    <div id="Main">
      <div className="banner">
        <video autoPlay muted loop>
          <source src="/vid/vid2.mp4" />
        </video>
      </div>
      <div className="content">
        <section className="sct_search">
          <div className="cont_form">
            <h2>카풀/택시팟을 찾아볼까요?</h2>
            <form onSubmit={searchTrips}>
              <input type="text" id="departure" placeholder="출발지" />
              <input
                type="text"
                id="arrival"
                className="search-input"
                placeholder="도착지"
              />
              <input type="date" id="tripDate" />
              <button type="submit">검색</button>
            </form>
            <div className="wrap">
              <button className={`btn_filter ${activeFilter === "전체" ? "active" : ""}`} onClick={() => filterTrips("전체")}>전체</button>
              <button className={`btn_filter ${activeFilter === "탑승자" ? "active" : ""}`} onClick={() => filterTrips("탑승자")}>탑승자</button>
              <button className={`btn_filter ${activeFilter === "운전자" ? "active" : ""}`} onClick={() => filterTrips("운전자")}>운전자</button>
              <button className={`btn_filter ${activeFilter === "택시" ? "active" : ""}`} onClick={() => filterTrips("택시")}>택시</button>
            </div>
          </div>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="btn_write"
          >
            카풀 요청하기
          </button>
        </section>
        <section className="sct_board">
          <h3>최근 게시물</h3>
          {isLoading ? (
            <p>데이터를 불러오는 중...</p>
          ) : error ? (
            <p>에러: {error}</p>
          ) : (
            <div className="cont_board">
              {filteredTrips
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((trip, index) => {
                  console.log('게시물 ID:', trip.id, '예약 정보:', trip.reservations);
                  if (trip.reservations && trip.reservations.length > 0) {
                    trip.reservations.forEach(reservation => {
                      console.log('예약자 이메일:', reservation.bookerId.email);
                    });
                  }
                  return (
                    <div
                      key={trip.id || index}
                      className="card"
                      onClick={() => handleEditClick(trip)}
                    >
                      <div className="row1">
                        <div className="img_profile"></div>
                        <div className="wrap">
                          <div className="user">
                            {trip.author?.name || "알 수 없음"}{" "}
                          </div>
                        </div>
                        <div className="manner">{trip.manner}</div>
                      </div>
                      <div className="row2">
                        <div className="route">
                          {trip.title.split(" ")[0]} {"->"}{" "}
                          {trip.title.split(" ")[2]}
                        </div>
                      </div>
                      <div className="row3">
                        <div className="calendar">
                          <img src="/img/calendar.png" alt="clock icon" />
                          {trip.title.split(" ")[4]}{" "}
                        </div>
                        <div className="time">
                          <img src="/img/clock.png" alt="clock icon" />
                          {trip.title.split(" ")[5]}에 출발
                        </div>
                        <div className="genderType">
                          <img src="/img/person.png" alt="person icon" />
                          {trip.title.split(" ")[3]} ·
                          {
                            trip.title.split(" ")[3] === "택시"
                              ? trip.title.split(" ")[6] // 택시일 경우 인원수 표시
                              : trip.title.split(" ")[6] // 택시가 아닐 경우 성별 표시
                          }
                        </div>
                        {trip.reservations && 
                         trip.reservations.length > 0 && 
                         trip.reservations.some(reservation => {
                           console.log('비교:', reservation.bookerId, userId);
                           return reservation.bookerId === userId;
                         }) && (
                          <div className="reservation-status">예약중</div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      </div>
      <Post
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={handleWriteSubmit}
      />
      <Editor
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editData={selectedTrip}
        refreshPosts={fetchTrips}
        postId={selectedTrip?.id}
      />
    </div>
  );
}
