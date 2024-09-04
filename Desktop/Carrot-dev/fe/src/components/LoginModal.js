import React, { useState } from 'react';
import './Modal.css';

function LoginModal({ onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 실제 로그인 로직을 구현해야 합니다.
    // 지금은 간단히 아이디와 비밀번호가 비어있지 않으면 로그인 성공으로 처리합니다.
    if (username && password) {
      onLogin(username);
      onClose();
    } else {
      alert('아이디와 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">로그인</button>
        </form>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}

export default LoginModal;