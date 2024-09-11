import './Login.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios.js'


export function Login({ onLogin }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/signin', { email, password });

      const token = response.headers['authorization']
      // console.log('Token:', token);

      if (token) {
        localStorage.setItem('token', token);
        onLogin(email);
      } else {
        alert('No token received.');
      }
      console.log("successfully logged in")
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (email == '11' && password == '1') {
  //     console.log('로그인 성공');
  //     onLogin(email);
  //     navigate('/main');
  //   } 
  // }

  return (
    <div id="Login">
      <form onSubmit={handleSubmit}>
        <h2>당근마차</h2>
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
        <button type="submit">로그인</button>
        <Link to="/Signup">회원가입</Link>
      </form>
    </div>
  );
}
