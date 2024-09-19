import './Chat.css'
import { useState, useEffect } from 'react'; // useEffect 추가
import io from 'socket.io-client'; // socket.io 클라이언트 추가

const socket = io('http://localhost:3001'); // 소켓 서버 연결

export function Chat() {
  const [message, setMessage] = useState(''); // 메시지 상태 추가
  const [messages, setMessages] = useState([]); // 메시지 목록 상태 추가
  const [isUser, setIsUser] = useState(true); // 사용자 여부 상태 추가

  useEffect(() => {
    socket.on('connect', () => {
        console.log('Connected to server'); // 연결 성공 메시지
    });

    socket.on('message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]); // 수신된 메시지 추가
    });

    return () => {
        socket.off('message'); // 컴포넌트 언마운트 시 소켓 이벤트 해제
    };
}, []);

const handleSend = () => {
  if (!message.trim()) return; // 메시지가 비어있으면 함수 종료
  const msg = { text: message, user: isUser };
  console.log('Sending message:', msg); // 전송할 메시지 로그
  socket.emit('message', msg); // 소켓을 통해 메시지 전송
  setMessage(''); // 메시지 입력 필드 초기화
  setIsUser(!isUser); // 사용자 여부 토글
  document.getElementById('messageInput').focus(); // 인풋 필드에 포커스
};

  return (
    <div id="Chat">
      <div className="chattingbox">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user ? 'user-message' : 'other-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="cont_input">
        <input 
          id="messageInput" // 인풋 필드에 id 추가
          type="text" 
          value={message} // 입력 필드에 상태 연결
          onChange={(e) => setMessage(e.target.value)} // 입력 변경 시 상태 업데이트
        />
        <input type="submit" value="전송" onClick={handleSend} /> {/* 전송 버튼 클릭 시 handleSend 호출 */}
      </div>
    </div>
  );
};