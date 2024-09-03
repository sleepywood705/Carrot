import React, { useState, useEffect } from 'react';
import './Modal.css';

function EditDeleteModal({ isOpen, onClose, trip, onEdit, onDelete }) {
  const [editedTrip, setEditedTrip] = useState({
    type: '',
    departure: '',
    arrival: '',
    time: '',
    date: ''
  });

  useEffect(() => {
    if (trip) {
      const [departure, arrival] = trip.route.split(' → ');
      setEditedTrip({
        type: trip.type,
        departure,
        arrival,
        time: trip.time.replace(' 출발', ''),
        date: trip.date
      });
    }
  }, [trip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTrip(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedTrip = {
      ...editedTrip,
      route: `${editedTrip.departure} → ${editedTrip.arrival}`,
      time: editedTrip.time + ' 출발'
    };
    onEdit(formattedTrip);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      onDelete(trip);
      onClose();
    }
  };

  if (!isOpen || !trip) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>글 수정/삭제</h2>
        <form onSubmit={handleSubmit}>
          <select
            name="type"
            value={editedTrip.type}
            onChange={handleChange}
          >
            <option value="탑승자">탑승자</option>
            <option value="운전자">운전자</option>
            <option value="택시">택시</option>
          </select>
          <input
            type="text"
            name="departure"
            value={editedTrip.departure}
            onChange={handleChange}
            placeholder="출발지"
            required
          />
          <input
            type="text"
            name="arrival"
            value={editedTrip.arrival}
            onChange={handleChange}
            placeholder="도착지"
            required
          />
          <input
            type="time"
            name="time"
            value={editedTrip.time}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={editedTrip.date}
            onChange={handleChange}
            required
          />
          <div className="button-group">
            <button type="submit">확인</button>
            <button type="button" onClick={handleDelete}>삭제</button>
            <button type="button" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDeleteModal;