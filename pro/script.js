// 오늘 날짜를 기본값으로 설정
document.getElementById('tripDate').valueAsDate = new Date();

function searchTrips() {
    const departure = document.getElementById('departure').value;
    const arrival = document.getElementById('arrival').value;
    const date = document.getElementById('tripDate').value;

    // 여기에서 실제 검색 로직을 구현합니다.
    // 지금은 간단한 알림으로 대체합니다.
    alert(`검색 요청:\n출발지: ${departure}\n도착지: ${arrival}\n날짜: ${date}`);
}

// 로그인 상태
let isLoggedIn = false;

// 로그인 버튼 클릭 이벤트
document.getElementById('loginButton').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('loginModal').style.display = 'block';
});

// 회원가입 버튼 클릭 이벤트
document.getElementById('signupButton').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signupModal').style.display = 'block';
});

// 로그인 폼 제출 이벤트
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // 여기에 실제 로그인 로직을 구현합니다.
    // 지금은 간단히 로그인 성공으로 가정합니다.
    isLoggedIn = true;
    updateUIForLoggedInUser();
    document.getElementById('loginModal').style.display = 'none';
});

function updateUIForLoggedInUser() {
    document.getElementById('loginButton').style.display = 'none';
    document.getElementById('signupButton').style.display = 'none';
    document.getElementById('profileButton').style.visibility = 'visible';
    document.getElementById('profileMenu').style.visibility = 'visible';
}

// 프로필 버튼 클릭 이벤트
document.getElementById('profileButton').addEventListener('click', function(e) {
    e.stopPropagation();
    toggleProfileMenu();
});

function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.classList.toggle('active');
}

// 페이지 클릭 시 프로필 메뉴 닫기
document.addEventListener('click', function(e) {
    const profileMenu = document.getElementById('profileMenu');
    const profileButton = document.getElementById('profileButton');
    
    if (!profileMenu.contains(e.target) && e.target !== profileButton) {
        profileMenu.classList.remove('active');
    }
});

// 필터링 
// 임의의 게시물 데이터
const trips = [
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

// 게시물 표시 함수
function displayTrips(filteredTrips = trips) {
    const tripList = document.getElementById('tripList');
    tripList.innerHTML = '';
    filteredTrips.forEach(trip => {
        const tripCard = document.createElement('div');
        tripCard.className = 'trip-card';
        tripCard.innerHTML = `
            <div class="trip-type">${trip.type}</div>
            <div class="trip-route">${trip.route}</div>
            <div class="trip-time">${trip.time}</div>
        `;
        tripList.appendChild(tripCard);
    });
}

// 초기 게시물 표시
displayTrips();

// 필터 버튼 이벤트 리스너
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        const filterType = this.textContent;
        const filteredTrips = filterType === '탑승자' ? trips.filter(trip => trip.type === '탑승자') :
                              filterType === '운전자' ? trips.filter(trip => trip.type === '운전자') :
                              filterType === '택시' ? trips.filter(trip => trip.type === '택시') :
                              trips;
        displayTrips(filteredTrips);
    });
});

// 검색 함수
function searchTrips() {
    const departure = document.getElementById('departure').value.toLowerCase();
    const arrival = document.getElementById('arrival').value.toLowerCase();
    const date = document.getElementById('tripDate').value;

    const filteredTrips = trips.filter(trip => {
        const [from, to] = trip.route.toLowerCase().split('→');
        const dateMatch = date === '' || trip.date === date;
        const departureMatch = departure === '' || from.trim().includes(departure);
        const arrivalMatch = arrival === '' || (to ? to.trim().includes(arrival) : from.includes(arrival));
        
        return dateMatch && departureMatch && arrivalMatch;
    });

    displayTrips(filteredTrips);
}

// 검색 입력 필드에 이벤트 리스너 추가
document.getElementById('departure').addEventListener('input', searchTrips);
document.getElementById('arrival').addEventListener('input', searchTrips);
document.getElementById('tripDate').addEventListener('change', searchTrips);

// 검색 버튼 이벤트 리스너 (이미 있는 경우 수정)
document.querySelector('.search-button').addEventListener('click', function(e) {
    e.preventDefault(); // 폼 제출 방지
    searchTrips();
});

