import "./Post.css";
import Map from "../api/Map";
import React, { useState, useEffect } from "react";
import axios from "../api/axios.js"

export function Post({ isOpen, onClose, onSubmit }) {
  const [mapData, setMapData] = useState(null);

  const handleMapSubmit = (data) => {
    setMapData(data);
  };

  if (!isOpen) return null;

  return (
    <div id="Post">
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

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        // 로그인 페이지로 리다이렉트하는 로직을 여기에 추가하세요
        return;
      }

      const config = {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      };

      const title = `${mapData.from} -> ${mapData.to}`;
      const content = `${type}님이 ${date} ${time}에 ${mapData.from}에서 ${mapData.to}로 가는 여정을 공유합니다. 성별: ${gender}`
    
      const postData = {
        title: title,
        content: content,
        from: mapData.from,
        to: mapData.to,
        date: date,
        time: time,
        type: type,
        gender: gender,
      };
      console.log('Sending post data:', postData);
      
      const postResponse = await axios.post('/posts/post', postData, config);
      console.log('Post가 성공적으로 생성되었습니다:', postResponse.data);

      // 서버 응답 데이터와 함께 선택한 데이터를 포함하여 전달
      onSubmit({...postResponse.data, ...postData});
      onClose();
    } catch (error) {
      console.error('데이터 저장 중 오류 발생:', error);
      if (error.response) {
        console.error('에러 응답 데이터:', error.response.data);
        console.error('에러 상태 코드:', error.response.status);
        console.error('에러 헤더:', error.response.headers);
        alert(`데이터 저장에 실패했습니다: ${error.response.data.error || '알 수 없는 오류'}`);
      } else if (error.request) {
        alert('서버로부터 응답이 없습니다. 네트워크 연결을 확인해 주세요.');
      } else {
        alert('요청 중 오류가 발생했습니다.');
      }
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
      <div className="a">
        <h2>몇 시에 출발하시나요?</h2>
        <input
          type="time"
          className="cnt_time"
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
      <div className="a">
        <h2>어떤 분과 탑승하시나요?</h2>
        <div className="wrap">
          <label>
            <input
              type="radio"
              id="anyone"
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
              id="same"
              name="gender"
              value="동성끼리 탑승"
              checked={gender === "동성끼리 탑승"}
              onChange={(e) => setGender(e.target.value)}
            />
            동성끼리 탑승
          </label>
        </div>
      </div>
      <button type="submit">작성</button>
    </form>
  );
}
