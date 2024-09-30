import { useState, useEffect } from "react";
import { Board } from "../../routes/Main";
import axios from "../../api/axios";

export function MyReservation() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserEmail();
    fetchTrips();
  }, []);

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

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/posts/gets');
      console.log('서버에서 받은 데이터:', response.data);

      if (response.data && Array.isArray(response.data.data)) {
        const tripsWithReservationStatus = response.data.data.map(trip => ({
          ...trip,
          isReservationCompleted: trip.isReservationCompleted || false
        }));
        setTrips(tripsWithReservationStatus);
        setFilteredTrips(tripsWithReservationStatus);
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

  const handleEditClick = (trip) => {
    // 예약 수정 로직을 여기에 추가할 수 있습니다.
    console.log('예약 수정 클릭:', trip);
  };

  return (
    <div id="MyReservation">
      <h2>내 예약</h2>
      <Board
        isLoading={isLoading}
        error={error}
        filteredTrips={filteredTrips}
        handleEditClick={handleEditClick}
        userId={userId}
      />
    </div>
  );
}