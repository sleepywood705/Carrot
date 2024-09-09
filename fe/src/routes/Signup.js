import './Login.css';
import { useState, useEffect } from 'react';


export function Signup() {
  return (
    <div id="Login">
      <h2>회원가입</h2>
      <form>
        <input
          type="text"
          placeholder="아이디"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          required
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          required
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}
