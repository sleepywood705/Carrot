import "./Main.css";
import { Poster } from "../components/Poster.js";
import { Editor } from "../components/Editor.js";
import { Board } from "../components/Board.js";
import { Search } from "../components/Search.js";
import { FilterButtons } from "../components/FilterButtons.js";
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
  const [userReservation, setUserReservation] = useState(null);
  const [isReservationLoading, setIsReservationLoading] = useState(false);

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

      if (response.data && Array.isArray(response.data.data)) {
        const tripsWithReservationStatus = response.data.data.map(trip => ({
          ...trip,
          isReservationCompleted: trip.isReservationCompleted || false
        }));
        setTrips(tripsWithReservationStatus);
      } else {
        throw new Error("서버에서 받은 데이터 구조가 예상과 다릅니다.");
      }
    } catch (error) {

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

    } catch (error) {

    }
  };

  const applyFiltersAndSearch = () => {
    let result = trips;

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

  const fetchUserReservation = async (postId) => {
    setIsReservationLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/reserve/gets', {
        headers: { 'Authorization': `${token}` }
      });
      const userReservation = response.data.data.find(
        reservation => reservation.post && reservation.post.id === postId && reservation.bookerId === userId
      );
      return userReservation || null;
    } catch (error) {

    } finally {
      setIsReservationLoading(false);
    }
  };

  const handleEditClick = async (trip) => {
    setIsReservationLoading(true);
    try {
      const reservation = await fetchUserReservation(trip.id);
      const isReservationEnded = trip.title.endsWith('[예약마감]');

      const updatedTrip = {
        ...trip,
        isReservationEnded: isReservationEnded
      };

      setUserReservation(reservation);
      setSelectedTrip(updatedTrip);
      setIsEditModalOpen(true);
    } catch (error) {

      alert('예약 정보를 가져오는 데 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsReservationLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTrip(null);
    setUserReservation(null);
    fetchTrips();
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
      <Poster
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
        userReservation={userReservation}
        userId={userId}
        isReservationEnded={selectedTrip?.isReservationEnded}
      />
    </div>
  );
}