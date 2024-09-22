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
  const [users, setUsers] = useState({});

  useEffect(() => {
    fetchTrips();
    fetchUsers();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axios.get('/posts/gets');
      console.log('서버에서 받은 데이터:', response.data);
      
      if (response.data && Array.isArray(response.data.data)) {
        setTrips(response.data.data);
        setFilteredTrips(response.data.data);
      } else {
        console.error('서버에서 받은 데이터 구조가 예상과 다릅니다:', response.data);
        setTrips([]);
        setFilteredTrips([]);
      }
    } catch (error) {
      console.error('포스팅 데이터를 가져오는 데 실패했습니다:', error);
      if (error.response) {
        console.error('에러 응답:', error.response.data);
        console.error('에러 상태:', error.response.status);
        console.error('에러 헤더:', error.response.headers);
      } else if (error.request) {
        console.error('요청이 이루어졌으나 응답을 받지 못했습니다.');
      } else {
        console.error('에러 메시지:', error.message);
      }
      setTrips([]);
      setFilteredTrips([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('users/users');
      console.log('서버에서 받은 사용자 데이터:', response.data);

      const usersData = {};
      if (response.data && Array.isArray(response.data.data)) {
        response.data.data.forEach(user => {
          usersData[user.id] = user.name;
        });
      } else if (Array.isArray(response.data)) {
        response.data.forEach(user => {
          usersData[user.id] = user.name;
        });
      } else {
        console.error('서버에서 받은 사용자 데이터 구조가 예상과 다릅니다:', response.data);
      }
      setUsers(usersData);
    } catch (error) {
      console.error('사용자 데이터를 가져오는 데 실패했습니다:', error);
      if (error.response) {
        console.error('에러 응답:', error.response.data);
        console.error('에러 상태:', error.response.status);
        console.error('에러 헤더:', error.response.headers);
      } else if (error.request) {
        console.error('요청이 이루어졌으나 응답을 받지 못했습니다.');
      } else {
        console.error('에러 메시지:', error.message);
      }
    }
  };

  const searchTrips = (event) => {
    event.preventDefault();
    const departure = document.getElementById("departure").value.toLowerCase();
    const arrival = document.getElementById("arrival").value.toLowerCase();
    const date = document.getElementById("tripDate").value;

    const filtered = trips.filter((trip) => {
      const [from, to] = trip.route.toLowerCase().split("→");
      const dateMatch = date === "" || trip.date === date;
      const departureMatch =
        departure === "" || from.trim().includes(departure);
      const arrivalMatch =
        arrival === "" ||
        (to ? to.trim().includes(arrival) : from.includes(arrival));

      return dateMatch && departureMatch && arrivalMatch;
    });

    setFilteredTrips(filtered);
  };

  const filterTrips = (filterType) => {
    setActiveFilter(filterType);
    if (filterType === "전체") {
      setFilteredTrips(trips);
    } else {
      const filtered = trips.filter((trip) => trip.type === filterType);
      setFilteredTrips(filtered);
    }
  };

  const handleWriteSubmit = (newTrip) => {
    console.log('새로운 여행 데이터:', newTrip);
    // 새로운 여행 데이터를 기존 데이터 배열의 맨 앞에 추가
    setTrips(prevTrips => [newTrip, ...prevTrips]);
    setFilteredTrips(prevFilteredTrips => [newTrip, ...prevFilteredTrips]);
    
    // 필요한 경우 여기에서 서버로 데이터를 다시 전송하거나 추가 처리를 할 수 있습니다.
  };

  const handleEdit = (editedTrip) => {
    const updatedTrips = trips.map((trip) =>
      trip === selectedTrip ? editedTrip : trip
    );
    setTrips(updatedTrips);
    setFilteredTrips(updatedTrips);
  };

  const handleDelete = (tripToDelete) => {
    const updatedTrips = trips.filter((trip) => trip !== tripToDelete);
    setTrips(updatedTrips);
    setFilteredTrips(updatedTrips);
  };

  const handleEditClick = (trip) => {
    setSelectedTrip(trip);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTrip(null);
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
          <div className="cnt_board">
            {filteredTrips && filteredTrips.map((trip, index) => (
              <div
                key={trip.id || index}
                className="card"
                onClick={() => handleEditClick(trip)}
              >
                <div className="row1">
                  <div className="profile"></div>
                  <div className="wrap">
                    <div className="user">{trip.author?.name || '알 수 없음'}</div>
                    <div className="type">
                      {trip.type} · {trip.date} {trip.time} 출발
                    </div>
                  </div>
                  <div className="manner">{trip.manner}</div>
                </div>
                <div className="row2">
                  <div className="route">{trip.title || `${trip.from} → ${trip.to}`}</div>
                </div>
                <div className="row3">
                  <div className="time">
                    <img src="/img/clock.png" alt="clock" />
                    {trip.date} {trip.time} 출발
                  </div>
                  <div className="genderType">
                    <img src="/img/person.png" alt="person" />
                    {trip.gender}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
