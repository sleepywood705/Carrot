import "./Modal_Posting.css";
import React, { useState, useEffect } from "react";
import Map from "../api/Map";

export function ModalEditor({ isOpen, onClose, onEdit, onDelete, editData }) {
  const [type, setType] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    if (isOpen) {
      console.log("ModalEditor opened with editData:", editData);
    }
  }, [isOpen, editData]);

  useEffect(() => {
    if (editData) {
      console.log("Setting form data from editData:", editData);
      setType(editData.type || "");
      setTime(editData.time?.split(" ")[0] || "");
      setDate(editData.date || "");
      setGender(editData.gender || "");
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...editData,
      type,
      time: `${time} 출발`,
      date,
      gender,
    };
    console.log("Submitting updated data:", updatedData);
    onEdit(updatedData);
    onClose();
  };

  const handleDelete = () => {
    console.log("Deleting data:", editData);
    onDelete(editData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="ModalPosting">
      <div className="posting-container">
        <Map editData={editData} />
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
            onChange={(e) => {
              console.log("Time changed:", e.target.value);
              setTime(e.target.value);
            }}
            required
          />
          <h2>언제 출발하시나요?</h2>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              console.log("Date changed:", e.target.value);
              setDate(e.target.value);
            }}
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
                onChange={(e) => {
                  console.log("Gender changed:", e.target.value);
                  setGender(e.target.value);
                }}
              />
              성별무관
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="동성끼리 탑승"
                checked={gender === "동성끼리 탑승"}
                onChange={(e) => {
                  console.log("Gender changed:", e.target.value);
                  setGender(e.target.value);
                }}
              />
              동성끼리 탑승
            </label>
          </div>
          <button type="submit">수정</button>
          <button type="button" onClick={handleDelete}>삭제</button>
        </form>
      </div>
    </div>
  );
}

export default ModalEditor;