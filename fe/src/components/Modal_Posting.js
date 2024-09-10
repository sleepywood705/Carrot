import "./Modal_Posting.css";
import "./Calendar.css";
import { useState, useEffect } from "react";

const { kakao } = window;

export function ModalPosting({ isOpen, onClose, onSubmit }) {
  
  if (!isOpen) return null;

  return (
    <div id="ModalPosting">
      <PostingForm onSubmit={onSubmit} onClose={onClose}/>
    </div>
  );
}

function PostingForm({ onSubmit, onClose }) {
  const [type, setType] = useState('탑승자');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [textArea, setTextArea] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type,
      route: `${departure} → ${arrival}`,
      time,
      date,
    });
    onClose();
  };

  const handleTextTyping = (e) => {
    setTextArea(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
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
      {/* <Calendar /> */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <h2>이동 설명</h2>
      <div className="cnt_textarea">
        <textarea
          value={textArea}
          onChange={handleTextTyping}
          onFocus={(e) => e.target.parentElement.classList.add("focus")}
          onBlur={(e) => {
            if (e.target.value === "") {
              e.target.parentElement.classList.remove("focus");
            }
          }}
        ></textarea>
        {textArea === "" && (
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
        <button></button>
        <button></button>
      </div>
      <button type="submit">작성</button>
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

// function Calendar() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [daysInMonth, setDaysInMonth] = useState([]);

//   useEffect(() => {
//     generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
//   }, [currentDate]);

//   const generateCalendar = (year, month) => {
//     const firstDayOfMonth = new Date(year, month, 1).getDay();
//     const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
//     const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

//     const calendarDays = [];
//     let week = [];

//     for (let i = firstDayOfMonth - 1; i >= 0; i--) {
//       week.push({ day: lastDateOfPrevMonth - i, isCurrentMonth: false });
//     }

//     for (let day = 1; day <= lastDateOfMonth; day++) {
//       week.push({ day, isCurrentMonth: true });
//       if (week.length === 7) {
//         calendarDays.push(week);
//         week = [];
//       }
//     }

//     let nextMonthDay = 1;
//     while (week.length < 7) {
//       week.push({ day: nextMonthDay++, isCurrentMonth: false });
//     }
//     calendarDays.push(week);

//     setDaysInMonth(calendarDays);
//   };

//   const handlePrevMonth = (event) => {
//     event.preventDefault();
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
//     );
//   };

//   const handleNextMonth = (event) => {
//     event.preventDefault();
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
//     );
//   };

//   const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

//   return (
//     <div className="calendar">
//       <h3>
//         {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
//         <div className="wrap_btn">
//           <button onClick={handlePrevMonth}></button>
//           <button onClick={handleNextMonth}></button>
//         </div>
//       </h3>
//       <table>
//         <thead>
//           <tr>
//             {daysOfWeek.map((day, index) => (
//               <th
//                 key={index}
//                 style={{
//                   color: index === 0 || index === 6 ? "#0075ff" : "#000",
//                 }}
//               >
//                 {day}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {daysInMonth.map((week, index) => (
//             <tr key={index}>
//               {week.map(({ day, isCurrentMonth }, dayIndex) => (
//                 <td
//                   key={dayIndex}
//                   style={{
//                     color: isCurrentMonth
//                       ? dayIndex === 0 || dayIndex === 6
//                         ? "#0075ff"
//                         : "#000"
//                       : "#aaa",
//                   }}
//                 >
//                   {day}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
