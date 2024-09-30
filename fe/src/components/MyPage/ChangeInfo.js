import { useState } from "react";
import axios from "../../api/axios";

export function ChangeInfo({ user }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const displayGender = (gender) => {
    switch (gender) {
      case "MALE":
        return "남성";
      case "FEMALE":
        return "여성";
      default:
        return gender;
    }
  };

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/users/update/${user.id}`,
        { password },
        {
          headers: { Authorization: token},
        }
      );
      console.log("토큰", token )
      setSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setError(null);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.response?.status === 401) {
        // window.location.href = "/login";
      } else if (!error.response) {
        setError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
      } else {
        setError(error.response?.data?.message || "비밀번호 변경에 실패했습니다.");
      }
      setSuccess(null);
    }
  };

  if (!user) {
    return <div>로딩 중...</div>;
  }

  return (
    <div id="ChangeInfo">
      <h2>회원정보변경</h2>
      <div className="cont">
        <div className="wrap">
          <span>이름</span>
          <div>{user.name}</div>
        </div>
        <div className="wrap">
          <span>성별</span>
          <div>{displayGender(user.gender)}</div>
        </div>
        <div className="wrap">
          <span>이메일</span>
          <div>{user.email}</div>
        </div>
        <div className="wrap">
          <span>비밀번호</span>
          <input
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="wrap">
          <span>비밀번호 확인</span>
          <input
            type="password"
            placeholder="******"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button className="btn_change" onClick={handlePasswordChange}>
          변경
        </button>
      </div>
    </div>
  );
}