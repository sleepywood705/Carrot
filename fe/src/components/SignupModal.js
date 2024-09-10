import React, { useState } from 'react';
import './Modal.css'; // 모달 스타일을 위한 CSS 파일
import axios from '../api/axios';

function SignupModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 회원가입 요청
      const response = await axios.post('/users/signup', {
        email,
        password,
        name: email,
        role: 'USER'
      });

      console.log('회원가입 성공:', response.data);
      onClose();
    } catch (error) {
      console.error('회원가입 오류:', error.response ? error.response.data : error.message);
      alert('회원가입에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
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