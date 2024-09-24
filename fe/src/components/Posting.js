import "./Posting.css";
import Map from "../api/Map";
import React, { useState, useEffect } from "react";
import axios from "../api/axios.js"

export function Post({ isOpen, onClose, onSubmit }) {
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") { onClose(); }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // handleMapSubmit 함수 정의
  const handleMapSubmit = (data) => {
    console.log('Map data received:', data); // 데이터 확인
    if (!mapData || mapData.from !== data.startName || mapData.to !== data.endName) {
      setMapData({
        from: data.startName,
        to: data.endName,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div id="Posting">
      <Map onMapSubmit={handleMapSubmit} />
      <PostingForm onSubmit={onSubmit} onClose={onClose} mapData={mapData} />
    </div>
  );
}

export function PostingForm({ onSubmit, onClose, mapData }) {
  const [type, setType] = useState("탑승자");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("성별무관");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taxiCapacity, setTaxiCapacity] = useState(2); // 새로운 상태 추가

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toTimeString().slice(0, 5);

    setDate(formattedDate);
    setTime(formattedTime);
  }, []);

  useEffect(() => {
    console.log('mapData 변경됨:', mapData);
  }, [mapData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mapData || !mapData.from || !mapData.to) {
      alert("지도에서 경로를 먼저 검색해주세요.");
      return;
    }

    // 중복 제출 방지
    if (isSubmitting) return; // 이미 제출 중이면 함수 종료
    setIsSubmitting(true); // 제출 시작

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        return;
      }

      const config = {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      };

      const title = `${mapData.from} -> ${mapData.to} ${type} ${date} ${time} ${type === '택시' ? `${taxiCapacity}인` : gender} `;

      const postData = {
        title: title,
        from: mapData.from,
        to: mapData.to,
        date: date,
        time: time,
        type: type,
        taxiCapacity: type === '택시' ? taxiCapacity : undefined, // 택시 선택 시 인원 수 추가
      };
      console.log('Sending post data:', postData);

      const postResponse = await axios.post('/posts/post', postData, config);
      console.log('Post가 성공적으로 생성되었습니다:', postResponse.data);

      // 서버 응답 데이터와 함께 선택한 데이터를 포함하여 전달
      onSubmit({ ...postResponse.data, ...postData });
      onClose();
    } catch (error) {
      console.error('데이터 저장 중 오류 발생:', error);
      // 에러 처리 로직
    } finally {
      setIsSubmitting(false); // 제출 완료
    }
  };

  const handleCloseModal = () => {
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="PostingForm">
      <div className="a">
        <h2>유형을 선택해 주세요<button onClick={handleCloseModal}></button></h2>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="탑승자">탑승자</option>
          <option value="운전자">운전자</option>
          <option value="택시">택시</option>
        </select>
      </div>
      {type === '택시' && (
        <div className="a">
          <h2>몇 명이 탑승하나요?</h2>
          <select
            value={taxiCapacity}
            onChange={(e) => setTaxiCapacity(Number(e.target.value))}
          >
            <option value={2}>2인</option>
            <option value={3}>3인</option>
            <option value={4}>4인</option>
          </select>
        </div>
      )}
      <div className="a">
        <h2>몇 시에 출발하시나요?</h2>
        <input
          type="time"
          className="cont_time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div className="a">
        <h2>언제 출발하시나요?</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      {type !== '택시' && (
        <div className="a">
          <h2>어떤 분과 탑승하시나요?</h2>
          <div className="wrap">
            <label>
              <input
                type="radio"
                id="anyone"
                name="type"
                value="성별무관"
                checked={gender === "성별무관"}
                onChange={(e) => setGender(e.target.value)}
              />
              성별무관
            </label>
            <label>
              <input
                type="radio"
                id="same"
                name="type"
                value="동성"
                checked={gender === "동성"}
                onChange={(e) => setGender(e.target.value)}
              />
              동성
            </label>
          </div>
        </div>
      )}
      <div className="cont_btn">
        <button type="submit">작성</button>
      </div>
    </form>
  );
}
