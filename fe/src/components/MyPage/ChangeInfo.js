export function ChangeInfo({ user }) {
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
  
    return (
      <div id="ChangeInfo">
        <h2>회원정보변경</h2>
        <div className="userInfo">
          <div>
            <span>이름</span>
            <div>{user.name}</div>
          </div>
          <div>
            <span>성별</span>
            <div>{displayGender(user.gender)}</div>
          </div>
          <div>
            <span>이메일</span>
            <div>{user.email}</div>
          </div>
          <div>
            <span>비밀번호</span>
            <input placeholder="******" />
          </div>
          <div>
            <span>비밀번호 확인</span>
            <input placeholder="******" />
          </div>
          <button className="btn_change">변경</button>
        </div>
      </div>
    );
  }