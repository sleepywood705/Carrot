import "./Post.css";
import { Chat } from "./Chat";
import { useState, useEffect } from "react";

export function Editor({
  isOpen,
  onClose,
  onEdit,
  onReserve,
  onDelete,
  editData,
  currentUser,
}) {

  const [user, setUser] = useState(null);
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") { onClose(); }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";  // 스크롤 비활성화
      askUserName(); // Editor가 열릴 때 한 번만 호출
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";  // 스크롤 활성화
    };
  }, [isOpen, onClose]);

  const askUserName = () => {
    const userName = prompt("당신의 이름을 입력하세요");
    console.log("received user name", userName);
    setUser(userName);
  };

  if (!isOpen) return null;

  return (
    <div id="Post">
      <PostingForm
        isOpen={isOpen}
        onEdit={onEdit}
        onDelete={onDelete}
        onClose={onClose}
        onReserve={onReserve}
        editData={editData}
        currentUser={currentUser}
      />
      <Chat user={user} messageList={messageList} setMessageList={setMessageList} />
    </div>
  );
}

function PostingForm({
  isOpen,
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
  const [gender, setGender] = useState("성별무관");

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

  if (!isOpen) return null;

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
      <div className="cont_btn">
        <button type="submit" onClick={handleSubmit}>수정하기</button>
        <button type="submit" onClick={handleReserve}>채팅하기</button>
        <button type="submit" onClick={handleDelete}>취소하기</button>
      </div>
    </form>
  );
}