import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Modal, Box } from "@mui/material";
import { IconButton } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

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

  const notifications = [
    {
      id: 1,
      filterName: "첫번째 필터",
      items: ["종목1", "종목2", "종목3"],
    },
    {
      id: 2,
      filterName: "두번째 필터",
      items: ["종목4", "종목5", "종목6"],
    },
    {
      id: 3,
      filterName: "세번째 필터",
      items: ["종목7", "종목8", "종목9"],
    },
  ];

  // 스크롤 바 css
  const styles = {
    // 스크롤바 전체 너비
    "::-webkit-scrollbar": {
      width: "12px",
    },

    // 스크롤바 트랙
    "::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "10px",
    },

    // 스크롤바 핸들
    "::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "10px",
    },

    // 스크롤바 핸들 호버
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  };

  return (
    <>
      <div className="user-noti" onClick={handleAlertOpen}>
        <NotificationsNoneIcon />
        <Modal open={isAlertOpen} onClose={handleAlertClose}>
          <ClickAwayListener onClickAway={handleAlertClose}>
            <Box
              sx={{
                position: "absolute",
                top: "8%",
                left: "70%",
                width: "20%",
                height: "40%",
                backgroundColor: "#ffffff",
                overflow: "auto",
                borderRadius: 3,
                ...styles,
              }}
            >
              {notifications.map((notification) => (
                <Paper
                  key={notification.id}
                  sx={{
                    my: 1,
                    mx: 1,
                    p: 3,
                  }}
                  elevation={3}
                >
                  <Typography variant="h6">
                    {notification.filterName}
                  </Typography>
                  <Typography variant="body1">
                    {notification.items.join(", ")}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </ClickAwayListener>
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
