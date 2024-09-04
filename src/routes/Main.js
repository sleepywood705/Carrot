import React, { useState, useEffect } from 'react';
import './Main.css';
import WritePostModal from '../components/WritePostModal';
import EditDeleteModal from '../components/EditDeleteModal';

function Main() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [activeFilter, setActiveFilter] = useState('전체');
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [taxiOption, setTaxiOption] = useState(null);
    const [waitingTaxis, setWaitingTaxis] = useState([]);
    const [passengerCount, setPassengerCount] = useState(2);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [estimatedCost, setEstimatedCost] = useState(null);

    useEffect(() => {
        // 초기 데이터 설정
        const initialTrips = [
            { type: '탑승자', route: '서울 → 부산', time: '오후 2:00 출발', date: '2024-09-03' },
            { type: '탑승자', route: '인천 → 대전', time: '오전 9:00 출발', date: '2024-09-04' },
            { type: '탑승자', route: '대구 → 광주', time: '오후 3:00 출발', date: '2024-09-03' },
            { type: '탑승자', route: '수원 → 천안', time: '저녁 7:00 출발', date: '2024-09-04' },
            { type: '운전자', route: '부산 → 서울', time: '오전 6:00 출발', date: '2024-09-03' },
            { type: '운전자', route: '대전 → 인천', time: '오후 1:00 출발', date: '2024-09-04' },
            { type: '운전자', route: '광주 → 대구', time: '오후 4:00 출발', date: '2024-09-03' },
            { type: '운전자', route: '천안 → 수원', time: '오전 10:00 출발', date: '2024-09-04' },
            { type: '택시', route: '서울 시내', time: '저녁 8:00 출발', date: '2024-09-03' },
            { type: '택시', route: '인천 국제공항 → 서울', time: '오전 7:00 출발', date: '2024-09-03' },
        ];
        setTrips(initialTrips);
        setFilteredTrips(initialTrips);
    }, []);

    const searchTrips = (event) => {
        event.preventDefault();
        const departure = document.getElementById('departure').value.toLowerCase();
        const arrival = document.getElementById('arrival').value.toLowerCase();
        const date = document.getElementById('tripDate').value;

        const filtered = trips.filter(trip => {
            const [from, to] = trip.route.toLowerCase().split('→');
            const dateMatch = date === '' || trip.date === date;
            const departureMatch = departure === '' || from.trim().includes(departure);
            const arrivalMatch = arrival === '' || (to ? to.trim().includes(arrival) : from.includes(arrival));
            
            return dateMatch && departureMatch && arrivalMatch;
        });

        setFilteredTrips(filtered);
    };

    const filterTrips = (filterType) => {
        setActiveFilter(filterType);
        if (filterType === '전체') {
            setFilteredTrips(trips);
        } else {
            const filtered = trips.filter(trip => trip.type === filterType);
            setFilteredTrips(filtered);
        }
        setTaxiOption(null);
        setWaitingTaxis([]);
        setEstimatedTime(null);
        setEstimatedCost(null);
    };

    const handleWriteSubmit = (newTrip) => {
        setTrips([newTrip, ...trips]);
        setFilteredTrips([newTrip, ...filteredTrips]);
    };

    const handleEdit = (editedTrip) => {
        const updatedTrips = trips.map(trip => 
            trip === selectedTrip ? editedTrip : trip
        );
        setTrips(updatedTrips);
        setFilteredTrips(updatedTrips);
    };

    const handleDelete = (tripToDelete) => {
        const updatedTrips = trips.filter(trip => trip !== tripToDelete);
        setTrips(updatedTrips);
        setFilteredTrips(updatedTrips);
    };

    const handleTaxiOptionSelect = (option) => {
        setTaxiOption(option);
        if (option === 'share') {
            setPassengerCount(2);
        }
        // 대기 중인 택시 목록 생성 (실제로는 API 호출 등으로 데이터를 가져와야 함)
        const dummyTaxis = [
            { id: 1, driver: '김택시', car: '소나타', plate: '서울 가 1234', rating: 4.5, capacity: 4 },
            { id: 2, driver: '이운전', car: 'K5', plate: '서울 나 5678', rating: 4.8, capacity: 4 },
            { id: 3, driver: '박기사', car: 'SM6', plate: '서울 다 9012', rating: 4.2, capacity: 6 },
        ];
        setWaitingTaxis(dummyTaxis);

        // 예상 시간과 비용 설정 (실제로는 API를 통해 계산된 값을 받아와야 함)
        setEstimatedTime(option === 'quick' ? '15분' : '20분');
        setEstimatedCost(option === 'quick' ? '15,000원' : '10,000원');
    };

    const handleIncreasePassengers = () => {
        setPassengerCount(prevCount => Math.min(prevCount + 1, 4));
    };

    const handleDecreasePassengers = () => {
        setPassengerCount(prevCount => Math.max(prevCount - 1, 2));
    };

    return (
        <>
            <main className="container">
                <div className="main-content">
                    <section className="search-section">
                        <h2 className="search-title">카풀/택시팟을 찾아볼까요?</h2>
                        <form className="search-form" onSubmit={searchTrips}>
                            <input type="text" id="departure" className="search-input" placeholder="출발지" />
                            <input type="text" id="arrival" className="search-input" placeholder="도착지" />
                            <input type="date" id="tripDate" className="search-input" />
                            <button type="submit" className="search-button">검색</button>
                        </form>
                        <div className="post-filter">
                            <button 
                                className={`filter-button ${activeFilter === '전체' ? 'active' : ''}`}
                                onClick={() => filterTrips('전체')}
                            >
                                전체
                            </button>
                            <button 
                                className={`filter-button ${activeFilter === '탑승자' ? 'active' : ''}`}
                                onClick={() => filterTrips('탑승자')}
                            >
                                탑승자
                            </button>
                            <button 
                                className={`filter-button ${activeFilter === '운전자' ? 'active' : ''}`}
                                onClick={() => filterTrips('운전자')}
                            >
                                운전자
                            </button>
                            <button 
                                className={`filter-button ${activeFilter === '택시' ? 'active' : ''}`}
                                onClick={() => filterTrips('택시')}
                            >
                                택시
                            </button>
                        </div>
                    </section>
                    <button onClick={() => setIsWriteModalOpen(true)} className="write-button">글쓰기</button>
                    
                    {activeFilter === '택시' && (
                        <div className="taxi-options">
                            <button 
                                onClick={() => handleTaxiOptionSelect('quick')} 
                                className={`taxi-option-button ${taxiOption === 'quick' ? 'active' : ''}`}
                            >
                                빠른 매칭
                            </button>
                            <button 
                                onClick={() => handleTaxiOptionSelect('share')} 
                                className={`taxi-option-button ${taxiOption === 'share' ? 'active' : ''}`}
                            >
                                함께 타기
                            </button>
                        </div>
                    )}

                    {taxiOption === 'share' && (
                        <div className="passenger-count">
                            <label>인원 수: </label>
                            <button onClick={handleDecreasePassengers} disabled={passengerCount <= 2}>-</button>
                            <span>{passengerCount}명</span>
                            <button onClick={handleIncreasePassengers} disabled={passengerCount >= 4}>+</button>
                        </div>
                    )}

                    {estimatedTime && estimatedCost && (
                        <div className="taxi-estimates">
                            <p>예상 소요 시간: {estimatedTime}</p>
                            <p>예상 요금: {estimatedCost}</p>
                        </div>
                    )}

                    {waitingTaxis.length > 0 && (
                        <section className="waiting-taxis">
                            <h3>대기 중인 택시</h3>
                            <div className="taxi-list">
                                {waitingTaxis.map(taxi => (
                                    <div key={taxi.id} className="taxi-item">
                                        <p>기사: {taxi.driver}</p>
                                        <p>차량: {taxi.car}</p>
                                        <p>번호판: {taxi.plate}</p>
                                        <p>평점: {taxi.rating}</p>
                                        <p>최대 탑승 인원: {taxi.capacity}명</p>
                                        {taxiOption === 'share' && (
                                            <p className={taxi.capacity >= passengerCount ? 'available' : 'unavailable'}>
                                                {taxi.capacity >= passengerCount ? '탑승 가능' : '인원 초과'}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="info-section">
                        <h3>최근 게시물</h3>
                        <div id="tripList" className="recent-trips">
                            {filteredTrips.map((trip, index) => (
                                <div key={index} className="trip-card" onClick={() => {
                                    setSelectedTrip(trip);
                                    setIsEditModalOpen(true);
                                }}>
                                    <div className="trip-type">{trip.type}</div>
                                    <div className="trip-route">{trip.route}</div>
                                    <div className="trip-time">{trip.time}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
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
        </>
    );
}

export default Main;