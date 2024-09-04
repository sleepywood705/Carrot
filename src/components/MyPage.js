import React, { useState, useEffect } from 'react';
import './MyPage.css';

function MyPage() {
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        // 실제 애플리케이션에서는 API를 통해 사용자 정보와 예약 내역을 가져와야 합니다.
        // 여기서는 더미 데이터를 사용합니다.
        setUser({
            name: '홍길동',
            email: 'hong@example.com',
            phone: '010-1234-5678'
        });

        setReservations([
            { id: 1, date: '2024-03-15', route: '서울 → 부산', type: '카풀' },
            { id: 2, date: '2024-03-20', route: '대구 → 광주', type: '택시' }
        ]);
    }, []);

    const renderProfile = () => (
        <div className="profile-info">
            <h3>프로필 정보</h3>
            {user && (
                <>
                    <p><strong>이름:</strong> {user.name}</p>
                    <p><strong>이메일:</strong> {user.email}</p>
                    <p><strong>전화번호:</strong> {user.phone}</p>
                </>
            )}
            <button className="edit-profile-btn">프로필 수정</button>
        </div>
    );

    const renderReservations = () => (
        <div className="reservations">
            <h3>예약 내역</h3>
            {reservations.map(reservation => (
                <div key={reservation.id} className="reservation-item">
                    <p><strong>날짜:</strong> {reservation.date}</p>
                    <p><strong>경로:</strong> {reservation.route}</p>
                    <p><strong>유형:</strong> {reservation.type}</p>
                </div>
            ))}
        </div>
    );

    const renderSettings = () => (
        <div className="settings">
            <h3>설정</h3>
            <div className="setting-item">
                <label>
                    <input type="checkbox" /> 이메일 알림 받기
                </label>
            </div>
            <div className="setting-item">
                <label>
                    <input type="checkbox" /> SMS 알림 받기
                </label>
            </div>
            <button className="save-settings-btn">설정 저장</button>
        </div>
    );

    return (
        <div className="mypage-container">
            <h2>마이페이지</h2>
            <div className="tab-buttons">
                <button 
                    className={activeTab === 'profile' ? 'active' : ''} 
                    onClick={() => setActiveTab('profile')}
                >
                    프로필
                </button>
                <button 
                    className={activeTab === 'reservations' ? 'active' : ''} 
                    onClick={() => setActiveTab('reservations')}
                >
                    예약 내역
                </button>
                <button 
                    className={activeTab === 'settings' ? 'active' : ''} 
                    onClick={() => setActiveTab('settings')}
                >
                    설정
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'profile' && renderProfile()}
                {activeTab === 'reservations' && renderReservations()}
                {activeTab === 'settings' && renderSettings()}
            </div>
        </div>
    );
}

export default MyPage;