import "./Main.css";
import WritePostModal from "../components/WritePostModal";
import EditDeleteModal from "../components/EditDeleteModal";
import React, { useState, useEffect } from "react";

function Main() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [activeFilter, setActiveFilter] = useState("전체");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    // 초기 데이터 설정
    const initialTrips = [
      {
        type: "탑승자",
        route: "서울 → 부산",
        time: "오후 2:00 출발",
        date: "2024-09-03",
				manner: "36.5",
      },
      {
        type: "탑승자",
        route: "인천 → 대전",
        time: "오전 9:00 출발",
        date: "2024-09-04",
				manner: "36.5",
      },
      {
        type: "탑승자",
        route: "대구 → 광주",
        time: "오후 3:00 출발",
        date: "2024-09-03",
				manner: "36.5",
      },
      {
        type: "탑승자",
        route: "수원 → 천안",
        time: "저녁 7:00 출발",
        date: "2024-09-04",
				manner: "36.5",
      },
      {
        type: "운전자",
        route: "부산 → 서울",
        time: "오전 6:00 출발",
        date: "2024-09-03",
				manner: "36.5",
      },
      {
        type: "운전자",
        route: "대전 → 인천",
        time: "오후 1:00 출발",
        date: "2024-09-04",
				manner: "36.5",
      },
      {
        type: "운전자",
        route: "광주 → 대구",
        time: "오후 4:00 출발",
        date: "2024-09-03",
				manner: "36.5",
      },
      {
        type: "운전자",
        route: "천안 → 수원",
        time: "오전 10:00 출발",
        date: "2024-09-04",
				manner: "36.5",
      },
      {
        type: "택시",
        route: "서울 시내",
        time: "저녁 8:00 출발",
        date: "2024-09-03",
				manner: "36.5",
      },
      {
        type: "택시",
        route: "인천 국제공항 → 서울",
        time: "오전 7:00 출발",
        date: "2024-09-03",
				manner: "36.5",
      },
    ];
    setTrips(initialTrips);
    setFilteredTrips(initialTrips);
  }, []);

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
    setTrips([newTrip, ...trips]);
    setFilteredTrips([newTrip, ...filteredTrips]);
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

  return (
    <div className="container">
				<div className="write-containter">
					<button
						onClick={() => setIsWriteModalOpen(true)}
						className="write-button"
					>
						작성하기
					</button>
					<video autoPlay muted loop>
            <source src="/vid/vid2.mp4"/>
          </video>
				</div>
				<div className="main-content">
					<section className="search-section">
						<h2 className="search-title">카풀/택시팟을 찾아볼까요?</h2>
						<form className="search-form" onSubmit={searchTrips}>
							<input
								type="text"
								id="departure"
								className="search-input"
								placeholder="출발지"
							/>
							<input
								type="text"
								id="arrival"
								className="search-input"
								placeholder="도착지"
							/>
							<input type="date" id="tripDate" className="search-input" />
							<button type="submit" className="search-button">
								검색
							</button>
						</form>
						<div className="post-filter">
							<button
								className={`filter-button ${
									activeFilter === "전체" ? "active" : ""
								}`}
								onClick={() => filterTrips("전체")}
							>
								전체
							</button>
							<button
								className={`filter-button ${
									activeFilter === "탑승자" ? "active" : ""
								}`}
								onClick={() => filterTrips("탑승자")}
							>
								탑승자
							</button>
							<button
								className={`filter-button ${
									activeFilter === "운전자" ? "active" : ""
								}`}
								onClick={() => filterTrips("운전자")}
							>
								운전자
							</button>
							<button
								className={`filter-button ${
									activeFilter === "택시" ? "active" : ""
								}`}
								onClick={() => filterTrips("택시")}
							>
								택시
							</button>
						</div>
					</section>
					<section className="info-section">
						<h3>최근 게시물</h3>
						<div id="tripList" className="recent-trips">
							{filteredTrips.map((trip, index) => (
								<div
									key={index}
									className="trip-card"
									onClick={() => {
										setSelectedTrip(trip);
										setIsEditModalOpen(true);
									}}
								>
									<div className="row1">
                    <div className="card-profile"></div>
                    <div className="wrap">
                      <div className="card-user">가나다</div>
										  <div className="card-type">{trip.type} · 30분 전</div>
                    </div>
										<div className="card-manner">{trip.manner}</div>
									</div>
									<div className="card-route">{trip.route}</div>
                  <div className="row3">
                    <div className="card-time">
                      <img src="/img/clock.png" alt="clock" />
                      {trip.time}
                    </div>
                    <div className="card-sexType">
                      <img src="/img/person.png" alt="clock" />
                      성별 무관
                    </div>
                  </div>
								</div>
							))}
						</div>
					</section>
          <WritePostModal
            isOpen={isWriteModalOpen}
            onClose={() => setIsWriteModalOpen(false)}
            onSubmit={handleWriteSubmit}
          />
          <EditDeleteModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            trip={selectedTrip}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
				</div>
    </div>
  );
}

export default Main;
