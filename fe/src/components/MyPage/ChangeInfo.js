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
            <input placeholder="******" />
          </div>
          <div className="wrap">
            <span>비밀번호 확인</span>
            <input placeholder="******" />
          </div>
          <button className="btn_change">변경</button>
        </div>
      </div>
    );
  }