import "./Modal_Posting.css";
import { useState, useEffect } from "react";

const { kakao } = window;

export function ModalPosting({ isOpen, onClose, onSubmit }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") { onClose(); }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown); 
      document.body.style.overflow = "hidden";  // 스크롤 비활성화
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";  // 스크롤 활성화
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="ModalPosting">
      <PostingForm onSubmit={onSubmit} onClose={onClose} />
    </div>
  );
}

export function PostingForm({ onSubmit, onClose }) {
  const [type, setType] = useState("탑승자");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("성별무관");

  useEffect(() => {
    // 현재 날짜와 시간을 가져오기
    const currentDate = new Date();

    // 날짜를 'YYYY-MM-DD' 형식으로 설정
    const formattedDate = currentDate.toISOString().split("T")[0];

    // 시간을 'HH:MM' 형식으로 설정
    const formattedTime = currentDate.toTimeString().slice(0, 5);

    setDate(formattedDate); // 현재 날짜 설정
    setTime(formattedTime); // 현재 시간 설정
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type,
      route: `${departure} → ${arrival}`,
      time,
      date,
      gender,
    });
    onClose();
  };

  const handleCloseModal = () => {
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="form_posting">
      <h2>
        유형을 선택해 주세요
        <button onClick={handleCloseModal}></button>
      </h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="탑승자">탑승자</option>
        <option value="운전자">운전자</option>
        <option value="택시">택시</option>
      </select>
      <h2>어디로 가시나요?</h2>
      <div className="wrap_route">
        <input
          type="text"
          placeholder="출발지를 입력해 주세요"
          onChange={(e) => setDeparture(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="도착지를 입력해 주세요"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          required
        />
      </div>
      <KakaoMap />
      <h2>몇 시에 출발하시나요?</h2>
      <input
        type="time"
        className="cnt_time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <h2>언제 출발하시나요?</h2>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <h2>어떤 분과 탑승하시나요?</h2>
      <div className="wrap_radio">
        <label>
          <input
            type="radio"
            name="gender"
            value="성별무관"
            checked={gender === "성별무관"}
            onChange={(e) => setGender(e.target.value)} // 성별 선택 처리
          />
          성별무관
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="동성끼리 탑승"
            checked={gender === "동성끼리 탑승"}
            onChange={(e) => setGender(e.target.value)} // 성별 선택 처리
          />
          동성끼리 탑승
        </label>
      </div>
      <button type="submit">작성</button>
    </form>
  );
}

export function KakaoMap() {
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById("map");
      const option = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, option);
    } else {
      console.error("Kakao 객체가 정의되지 않았습니다.");
    }
  }, []);
  return <div id="map"></div>;
}
