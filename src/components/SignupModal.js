import React, { useState } from 'react';
import './Modal.css'; // 모달 스타일을 위한 CSS 파일

function SignupModal({ onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    // 여기에 회원가입 로직을 구현하세요
    console.log('회원가입 시도:', username, password);
    // 회원가입 성공 후 모달 닫기
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>회원가입</h2>
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
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">회원가입</button>
        </form>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default SignupModal;