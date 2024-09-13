import './Login.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios.js'


export function Login({ onLogin }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        <button type="submit" className="login">로그인</button>
        <Link to="/signup" className="signup">회원가입</Link>
      </form>
    </div>
  );
}
