import React, { useState } from 'react';
import './Modal.css';

function WritePostModal({ isOpen, onClose, onSubmit }) {
  const [type, setType] = useState('탑승자');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      type, 
      route: `${departure} → ${arrival}`, 
      time, 
      date 
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>새 글 작성</h2>
        <form onSubmit={handleSubmit}>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="탑승자">탑승자</option>
            <option value="운전자">운전자</option>
            <option value="택시">택시</option>
          </select>
          <input
            type="text"
            placeholder="출발지"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="도착지"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className="button-group">
            <button type="submit">작성</button>
            <button type="button" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WritePostModal;