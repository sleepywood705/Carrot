import './Login.css';
import React, { useState, useEffect } from 'react';
import axios from "../api/axios.js"


export function Signup() {

  const [usermail, setUsermail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  // const [username, setUsername] = useState('');
  // const [usergender, setUsergender] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const response = await axios.post('/users/signup', {
        email: usermail,
        password,
        name: usermail,
      });
      // 회원가입 성공 시 처리
      console.log('회원가입 성공:', response.data);
    } catch (err) {
      console.log('회원가입 응답:', response.data);
      console.error('회원가입 오류:', err.response ? err.response.data : err);
      alert('회원가입에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div id="Login">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} >
        <input
          type="text"
          value={usermail}
          onChange={(e) => setUsermail(e.target.value)}
          placeholder="이메일을 입력해 주세요"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해 주세요"
          required
        />
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="비밀번호를 확인해 주세요"
          required
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}
