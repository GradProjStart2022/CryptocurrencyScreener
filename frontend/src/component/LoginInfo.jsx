import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Modal, Box } from "@mui/material";
import { IconButton } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

import { clearUser } from "../redux/store";

/**
 * 로그인 버튼 컴포넌트 반환용 함수
 * @param {any} props react props
 * @returns 로그인 버튼 UI요소
 */
const LoginBtn = (props) => {
  const navigate = props.navigate;
  return (
    <button
      type="button"
      className="login-btn"
      onClick={() => {
        navigate("/login");
      }}
    >
      로그인
    </button>
  );
};

/**
 * 계정 정보 컴포넌트 반환용 함수
 * @param {any} props react props
 * @returns 계정 정보 UI요소
 */
const AccInfo = (props) => {
  const dispatch = useDispatch();
  const navigate = props.navigate;

  const [isAlertOpen, setAlertOpen] = useState(false);
  const handleAlertOpen = () => setAlertOpen(true);
  const handleAlertClose = () => setAlertOpen(false);

  return (
    <>
      <div className="user-noti" onClick={handleAlertOpen}>
        <NotificationsNoneIcon />
        <Modal open={isAlertOpen} onClose={handleAlertClose}>
          <Box
            sx={{
              position: "absolute",
              top: "8%",
              left: "70%",
              width: "20%",
              height: "40%",
              backgroundColor: "#ffffff",
            }}
          ></Box>
        </Modal>
      </div>
      <div className="account-info">
        <img
          src={props.userStore.accimg}
          alt={"사진"}
          className="acc-profile"
        ></img>
        <span className="acc-name">{props.userStore.accname}</span>
        <IconButton
          size="small"
          onClick={() => {
            dispatch(clearUser());
            window.alert("로그아웃되었습니다.");
            navigate(0);
          }}
        >
          <LogoutIcon fontSize="inherit" />
        </IconButton>
      </div>
    </>
  );
};

/**
 * 로그인 정보 컴포넌트 함수
 * @param {any} props react props
 * @returns 로그인 버튼 혹은 계정 정보 래핑 UI요소
 */
const LoginInfo = (props) => {
  const userStore = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="account-area">
      {userStore?.access_token ? (
        <AccInfo navigate={navigate} userStore={userStore} />
      ) : (
        <LoginBtn navigate={navigate} />
      )}
    </div>
  );
};

export default LoginInfo;
