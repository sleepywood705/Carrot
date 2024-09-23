import "./Main.css";
import { Post } from "../components/Posting";
import { Editor } from "../components/Editor";
import { useState, useEffect } from "react";
import axios from "../api/axios.js";

export function Main() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [activeFilter, setActiveFilter] = useState("전체");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {

      const response = await axios.get('/posts/gets');
      console.log('서버에서 받은 데이터:', response.data);
      
      if (response.data && Array.isArray(response.data.data)) {
        setTrips(response.data.data);
        setFilteredTrips(response.data.data);
      } else {
        throw new Error('서버에서 받은 데이터 구조가 예상과 다릅니다.');
      }
    } catch (error) {
      console.error('포스팅 데이터를 가져오는 데 실패했습니다:', error);
      setError(error.message || '데이터를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWriteSubmit = (newTrip) => {
    setTrips((prevTrips) => [newTrip, ...prevTrips]);
    setFilteredTrips((prevFilteredTrips) => [newTrip, ...prevFilteredTrips]);

    // 게시물 추가 후 페이지 새로고침
    window.location.reload();
  };

  const handleEdit = async (editedTrip) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해 주세요.');
      }

      const config = {
        headers: { 'Authorization': `${token}` }
      };
      await axios.put(`/posts/update/${editedTrip.id}`, editedTrip, {
        headers: { 'Authorization': `${localStorage.getItem('token')}` }
      });
    } catch (error) {
      console.error('게시물 수정 중 오류 발생:', error);
      alert('게시물을 수정하는 데 실패했습니다.');
    }
  };

  const handleDelete = async (tripToDelete) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해 주세요.');
      }

      const config = {
        headers: { 'Authorization': `${token}` }
      };
      await axios.delete(`/posts/delete/${tripToDelete.id}`, {
        headers: { 'Authorization': `${localStorage.getItem('token')}` }
      });
    } catch (error) {
      console.error('게시물 삭제 중 오류 발생:', error);
      alert('게시물을 삭제하는 데 실패했습니다.');
    }
  };

  const handleEditClick = (trip) => {

    const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해 주세요.');
      }

      const config = {
        headers: { 'Authorization': `${token}` }
      };
    setSelectedTrip(trip); // 선택한 trip 데이터를 설정
    setIsEditModalOpen(true); // 에디터 모달 열기
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTrip(null);
  };

  const searchTrips = (event) => {
    event.preventDefault();
    const departure = document.getElementById("departure").value.toLowerCase();
    const arrival = document.getElementById("arrival").value.toLowerCase();
    const date = document.getElementById("tripDate").value;

    const filtered = trips.filter((trip) => {
      const fromMatch = trip.from.toLowerCase().includes(departure);
      const toMatch = trip.to.toLowerCase().includes(arrival);
      const dateMatch = date === "" || trip.date === date;

      return fromMatch && toMatch && dateMatch;
    });

    setFilteredTrips(filtered);
  };

  const filterTrips = (filterType) => {
    setActiveFilter(filterType);
    if (filterType === "전체") {
      setFilteredTrips(trips);
    } else {
      const filtered = trips.filter((trip) => trip.role === filterType);
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
          <div className="cnt_form">
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
              <button
                className={`btn_filter ${
                  activeFilter === "전체" ? "active" : ""
                }`}
                onClick={() => filterTrips("전체")}
              >
                전체
              </button>
              <button
                className={`btn_filter ${
                  activeFilter === "탑승자" ? "active" : ""
                }`}
                onClick={() => filterTrips("탑승자")}
              >
                탑승자
              </button>
              <button
                className={`btn_filter ${
                  activeFilter === "운전자" ? "active" : ""
                }`}
                onClick={() => filterTrips("운전자")}
              >
                운전자
              </button>
              <button
                className={`btn_filter ${
                  activeFilter === "택시" ? "active" : ""
                }`}
                onClick={() => filterTrips("택시")}
              >
                택시
              </button>
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
            <div className="cnt_board">
              {filteredTrips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((trip, index) => (
                <div
                  key={trip.id || index}
                  className="card"
                  onClick={() => handleEditClick(trip)} // 클릭 시 handleEditClick 호출
                >
                  <div className="row1">
                    <div className="profile"></div>
                    <div className="wrap">
                      <div className="user">{trip.author?.name || '알 수 없음'} </div>
                    </div>
                    <div className="manner">{trip.manner}</div>
                  </div>
                  <div className="row2">
                    <div className="route">{trip.title.split(" ")[0]} {"->"} {trip.title.split(" ")[2]}</div>
                  </div>
                  <div className="row3">
                    <div className="time">
                      <img src="/img/clock.png" alt="clock" />
                      출발 : {trip.title.split(" ")[4]} , {trip.title.split(" ")[5]} 
                    </div>
                    <div className="genderType">
                      <img src="/img/person.png" alt="person" />
                      {trip.title.split(" ")[3]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Post
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={handleWriteSubmit} // onSubmit prop 전달
      />
      <Editor
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editData={selectedTrip} // 선택한 trip을 editData로 전달
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
