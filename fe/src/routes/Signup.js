import './Login.css';
import { useState, useEffect } from 'react';


export function Signup() {

  const [usermail, setUsermail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div id="Login">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} >
        <input
          type="email"
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
