import "./Modal_Posting.css";
import "./Calendar.css";
import { useState, useEffect } from "react";

const { kakao } = window;

export function ModalEditor({ isOpen, onClose, onEdit,onReserve, onDelete, editData, currentUser }) {
  if (!isOpen) return null;

  return (
    <div id="ModalPosting">
      <PostingForm 
      onEdit={onEdit} 
      onDelete={onDelete} 
      onClose={onClose} 
      onReserve={onReserve}
      editData={editData}
      currentUser={currentUser} 
      />
    </div>
  );
}

function PostingForm({ onEdit, onDelete, onClose, onReserve, editData, currentUser }) {
  const [type, setType] = useState('탑승자');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editData) {
      setType(editData.type || '');
      const [dep, arr] = (editData.route || '').split('→');
      setDeparture(dep ? dep.trim() : '');
      setArrival(arr ? arr.trim() : '');
      setTime(editData.time || '');
      setDate(editData.date || '');
      setDescription(editData.description || '');
    }
  }, [editData]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const editedTrip = {
      type,
      route: `${departure} → ${arrival}`,
      time,
      date,
      description
    };
    onEdit(editedTrip);
    onClose();
  };

  const handleDelete = () => {
    onDelete(editData);
    onClose();
  };

  const handleReserve = () => {
    if (onReserve) {
      onReserve(editData);
    }
    onClose();
  };

  const isAuthor = currentUser && editData && currentUser.name === editData.authorName;

  return (
    <form onSubmit={handleSubmit}>
      <h2>게시물 수정</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="탑승자">탑승자</option>
        <option value="운전자">운전자</option>
        <option value="택시">택시</option>
      </select>
      <h2>어디로 가시나요?</h2>
      <div className="wrap_route">
        <input
          type="text"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          placeholder="출발지를 입력해 주세요"
          required
        />
        <input
          type="text"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          placeholder="도착지를 입력해 주세요"
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
      <h2>이동 설명</h2>
      <div className="cnt_textarea">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={(e) => e.target.parentElement.classList.add("focus")}
          onBlur={(e) => {
            if (e.target.value === "") {
              e.target.parentElement.classList.remove("focus");
            }
          }}
        ></textarea>
        {description === "" && (
          <>
            <p>
              어떤 카풀인가요?
              <br />
              자세히 설명하면 탑승자들에게 도움이 됩니다.
              <br />
              예) 경유 가능, 시간 조율 가능, 앞자리 타도 돼요
            </p>
            <span>0 / 150</span>
          </>
        )}
      </div>
      <h2>어떤 분과 탑승하시나요?</h2>
      <div className="wrap_btn">
        <button type="button"></button>
        <button type="button"></button>
      </div>
      <div className="button-group">
        {isAuthor ? (
          <>
            <button type="submit">수정</button>
            <button type="button" onClick={handleDelete}>삭제</button>
            <button type="button" onClick={onClose}>취소</button>
          </>
        ) : (
          <button type="button" onClick={handleReserve}>예약하기</button>
        )}
      </div>
    </form>
  );
}

function KakaoMap() {
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
