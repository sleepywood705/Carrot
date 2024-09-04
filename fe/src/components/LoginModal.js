import React, { useState } from 'react';
import './Modal.css';
import axios from '../api/axios';

function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/signin', { email, password });
      console.log(response)
      const token = response.headers["authorization"]
      console.log(response.headers, response.headers["authorization"], token)
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', token);
      onLogin(email);
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
