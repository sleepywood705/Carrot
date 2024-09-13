import "./Modal_Posting.css";
import React, { useState, useEffect } from "react";
import Map from "../api/Map";

export function ModalPosting({ isOpen, onClose, onSubmit }) {
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
      <PostingForm onSubmit={onSubmit} onClose={onClose} />
    </div>
  );
}

export function PostingForm({ onSubmit, onClose }) {
  const [type, setType] = useState("탑승자");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("성별무관");
  const [mapSearched, setMapSearched] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toTimeString().slice(0, 5);

    setDate(formattedDate);
    setTime(formattedTime);
  }, []);
  
  const handleMapSubmit = (mapData) => {
    setMapSearched(true);
   };

   const handleSubmit = (e) => {
    e.preventDefault();
    if (!mapSearched) {
      alert("지도에서 경로를 먼저 검색해주세요.");
      return;
    }
    onSubmit({
      type,
      time,
      date,
      gender,
     
    });
    onClose();
  };

  return (
    
    <div className="posting-container">
     <div className="posting-container">
      <div className="map-section">
        <Map onMapSubmit={handleMapSubmit} />
      </div>
      <form onSubmit={handleSubmit} className="form_posting">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="탑승자">탑승자</option>
          <option value="운전자">운전자</option>
          <option value="택시">택시</option>
        </select>
        
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
              onChange={(e) => setGender(e.target.value)}
            />
            성별무관
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="동성끼리 탑승"
              checked={gender === "동성끼리 탑승"}
              onChange={(e) => setGender(e.target.value)}
            />
            동성끼리 탑승
          </label>
        </div>
        <button type="submit">작성</button>
      </form>
      </div>
    </div>
  );
}

export default ModalPosting;
