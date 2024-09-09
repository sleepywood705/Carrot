import './Login.css';
import '../components/Modal.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export function Login({ onLogin }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === '11' && password === '1') {
      onLogin(username);
    } else {
      alert('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };
  
  return (
    <div id="Login">
      <h2>당근마차</h2>
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
        <div className="wrap">
          <input type="checkbox" id="remember"></input>
          <label htmlFor="remember">아이디 기억하기</label>
        </div>
        <button type="submit">로그인</button>
        <Link to="/Signup">회원가입</Link>
      </form>
      <div><span>간편하게 시작하기</span></div>
      <button className="kakao">카카오 아이디로 로그인하기</button>
      <button className="google">구글 아이디로 로그인하기</button>
    </div>
  );
}
