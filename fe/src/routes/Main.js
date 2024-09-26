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
      setFilteredTrips(trips);
    } else {
      const filtered = trips.filter(
        (trip) => trip.title.split(" ")[3] === filterType
      );
      setFilteredTrips(filtered);
    }
    
    // 검색 조건 초기화
    setSearchParams({ departure: "", arrival: "", date: "" });
    // 입력 필드 초기화
    document.getElementById("departure").value = "";
    document.getElementById("arrival").value = "";
    document.getElementById("tripDate").value = "";
  };

  const handleSearch = (newSearchParams) => {
    setSearchParams(newSearchParams);
    applyFiltersAndSearch();
  };

  return (
    <div id="Main">
      <Search
        onSearch={handleSearch}
        activeFilter={activeFilter}
        onFilterChange={filterTrips}
        onWriteClick={() => setIsWriteModalOpen(true)}
      />
      <FilterButtons
        activeFilter={activeFilter} 
        onFilterChange={filterTrips}
        onWriteClick={() => setIsWriteModalOpen(true)}
      />
      <h1>최근 게시글</h1>

      <Board
        isLoading={isLoading}
        error={error}
        filteredTrips={filteredTrips}
        handleEditClick={handleEditClick}
        userId={userId}
      />

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

function Board({ isLoading, error, filteredTrips, handleEditClick, userId }) {
  return (
    <section id="Board">
      {isLoading ? (
        <p>데이터를 불러오는 중...</p>
      ) : error ? (
        <p>에러: {error}</p>
      ) : (
        <div className="Board">
          {filteredTrips
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((trip, index) => {
              // console.log('게시물 ID:', trip.id, '예약 정보:', trip.reservations);
              if (trip.reservations && trip.reservations.length > 0) {
                trip.reservations.forEach(reservation => {
                  console.log('예약자 이메일:', reservation.bookerId.email);
                });
              }
              return (
                <div
                  key={trip.id || index}
                  className="Card"
                  onClick={() => handleEditClick(trip)}
                >
                  <div className="row1">
                    <div className="user-name">
                      <span>{trip.author?.name || "알 수 없음"}{" "}</span>
                    </div>
                    <div className="card-title">
                      <span>
                        <img src="/img/siren.png" />
                        예) 출근파티 구해용 동성만~~~!
                      </span>
                    </div>
                  </div>
                  <div className="row2">
                    <div className="route">
                      <p>출발지<span>{trip.title.split(" ")[0]}</span></p>
                      <p>도착지<span>{trip.title.split(" ")[2]}</span></p>
                    </div>
                    <div className="date">
                      <p>날짜<span>{trip.title.split(" ")[4]}{" "}</span></p>
                      <p>출발<span>{trip.title.split(" ")[5]}</span></p>
                    </div>
                  </div>
                  <div className="row3">
                    <span className="gen-type">
                      {trip.title.split(" ")[3]}
                      ·
                      {
                        trip.title.split(" ")[3] === "택시"
                          ? trip.title.split(" ")[6]
                          : trip.title.split(" ")[6]
                      }
                    </span>
                    <div className="switch">
                      <div className="gear"></div>
                    </div>
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
              );
            })}
        </div>
      )}
    </section>
  );
}

function Search({ onSearch }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const newSearchParams = {
      departure: event.target.departure.value,
      arrival: event.target.arrival.value,
      date: event.target.tripDate.value,
    };
    onSearch(newSearchParams);
  };

  return (
    <section id="Search">
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          id="departure"
          placeholder="출발지" />
        <input
          type="text"
          id="arrival"
          placeholder="도착지" />
        <input 
          type="date" 
          id="tripDate" />
        <button 
          type="submit"
          className="butn_search"
        >
          검색
        </button>
      </form>
    </section>
  );
}

function FilterButtons({ onFilterChange, onWriteClick }) {
  const filters = ["전체", "택시", "운전자", "탑승자"];
  const filtersClass = ["butn_all", "butn_taxi", "butn_driver", "butn_passenger"];
  const filterImages = [null, "/img/taxi.png", "/img/wheel.png", "/img/siren.png"];

  return (
    <div id="FilterButtons">
      {filters.map((filter, index) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={filtersClass[index]}
        >
          {filterImages[index] && <img src={filterImages[index]} />}
          {filter}
        </button>
      ))}
      <button 
        onClick={onWriteClick}
        className="butn_write"
      >
        작성
      </button>
    </div>
  );
}