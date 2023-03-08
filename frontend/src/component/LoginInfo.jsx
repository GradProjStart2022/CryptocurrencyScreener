import { useNavigate } from "react-router-dom";

const LoginInfo = (props) => {
  const navigate = useNavigate();

  return (
    <div className="account-area">
      <button
        type="button"
        className="login-btn"
        onClick={() => {
          navigate("/login");
        }}
      >
        로그인
      </button>

      {/* <div className="user-noti"></div>
      <div className="account-info">
        <img src={""} alt={"사진"} className="acc-profile"></img>
        <span className="acc-name">계정명</span>
      </div> */}
    </div>
  );
};

export default LoginInfo;
