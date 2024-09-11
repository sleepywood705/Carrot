import "./Modal_Posting.css";
import { useState, useEffect } from "react";

const { kakao } = window;

export function ModalEditor({
  isOpen,
  onClose,
  onEdit,
  onReserve,
  onDelete,
  editData,
  currentUser,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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

function PostingForm({
  onEdit,
  onDelete,
  onClose,
  onReserve,
  editData,
  currentUser,
}) {
  const [type, setType] = useState("탑승자");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("성별무관");  // 성별 상태 추가

  useEffect(() => {
    if (editData) {
      setType(editData.type || "");
      const [dep, arr] = (editData.route || "").split("→");
      setDeparture(dep ? dep.trim() : "");
      setArrival(arr ? arr.trim() : "");
      setTime(editData.time || "");
      setDate(editData.date || "");
      setDescription(editData.description || "");
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const editedTrip = {
      type,
      route: `${departure} → ${arrival}`,
      time,
      date,
      description,
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

  const handleCloseModal = () => {
    onClose();
  }

  const isAuthor =
    currentUser && editData && currentUser.name === editData.authorName;

  return (
    <form onSubmit={handleSubmit} className="form_posting">
      <h2>
        게시물 수정
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
      <div className="wrap_btn">
        <button type="submit" onClick={handleReserve}>
          예약하기
        </button>
        <button type="submit" onClick={handleSubmit}>
          수정하기
        </button>
        <button type="submit" onClick={handleDelete}>
          취소하기
        </button>
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
