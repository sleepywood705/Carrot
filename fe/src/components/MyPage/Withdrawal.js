import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios.js";


export function Withdrawal() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleWithdrawal = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');

      // Fetch user information to get the ID
      const response = await axios.get('/users/me', {
        headers: {
          Authorization: token
        }
      });

      const userId = response.data.data.id;

      // Make the delete request with the user ID
      await axios.delete(`/users/delete/${userId}`, {
        headers: {
          Authorization: token
        }
      });
      setSuccess(true);
      localStorage.removeItem('token');
      navigate('/', { replace: true })

    } catch (err) {
      console.error(err);
      setError('계정 삭제에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsDeleting(false);
    }

  };


  if (success) {
    return (
      <div id="Withdrawal" className="withdrawal-container">
        <h2>회원탈퇴</h2>
        <div className="success-message">
          계정이 성공적으로 삭제되었습니다. 이용해 주셔서 감사합니다.
        </div>
      </div>
    );
  }

  return (
    <div id="Withdrawal" className="withdrawal-container">
      <h2>회원탈퇴</h2>
      <div className="withdrawal-content">
        <p>
          앗, 정말 탈퇴하시겠어요?
          <br />
          출퇴근길이 힘들어질지도 몰라요😥
        </p>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="button-wrapper">
        <button
          className="withdrawal-button"
          onClick={() => handleWithdrawal()}
          disabled={isDeleting}
        >
          {isDeleting ? '처리 중...' : '탈퇴'}
        </button>
      </div>
    </div>
  );
}