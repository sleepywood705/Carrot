import './Login.css';
import axios from "../api/axios.js"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Signup() {

  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [userMail, setUserMail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [userGender, setUserGender] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const response = await axios.post('/users/signup', {
        name: userName,
        email: userMail,
        password,
        gender: userGender,
      });
      // 회원가입 성공 시 처리
      alert('회원가입 성공:', response.data);
      console.log('회원가입 성공:', response.data);
      navigate('/main');
    } catch (err) {
      console.log(err)
      alert('회원가입에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div id="Login">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} >
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="이름을 입력해 주세요"
          required
        />
        <input
          type="email"
          value={userMail}
          onChange={(e) => setUserMail(e.target.value)}
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
        <div className='wrap radio'>
          <label htmlFor="man">
            <input 
              type="radio" 
              id="man" 
              name="gender" 
              value="male" 
              onChange={(e) => setUserGender(e.target.value)}
            />
            남성
          </label>
          <label htmlFor="woman">
            <input 
              type="radio" 
              id="woman" 
              name="gender" 
              value="female" 
              onChange={(e) => setUserGender(e.target.value)}
            />
            여성
          </label>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}
