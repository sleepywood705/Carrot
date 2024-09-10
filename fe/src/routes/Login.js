import './Login.css';
import '../components/Modal_Post.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios.js'


export function Login({ onLogin }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/signin', { email, password });

      const token = response.headers['authorization']
      console.log('Token:', token);

      if (token) {
        console.log('                   succesfull')
        localStorage.setItem('token', token);
        onLogin(email);
      } else {
        alert('No token received.');
      }
      console.log('login_process_ended')
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

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
        <div className="wrap">
          <input type="checkbox" id="remember"></input>
          <label htmlFor="remember">아이디 기억하기</label>
        </div>
        <button type="submit">로그인</button>
        <Link to="/Signup">회원가입</Link>
        <div><span>간편하게 시작하기</span></div>
        <button className="kakao">카카오 아이디로 로그인하기</button>
        <button className="google">구글 아이디로 로그인하기</button>
      </form>
    </div>
  );
}
