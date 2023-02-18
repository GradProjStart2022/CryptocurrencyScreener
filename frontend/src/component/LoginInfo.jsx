import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Typography } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsIcon from "@mui/icons-material/Notifications";

const LoginInfo = (props) => {
  const navigate = useNavigate();
  const [isAlertOpen, setAlertOpen] = useState(false);
  const handleAlertOpen = () => setAlertOpen(true);
  const handleAlertClose = () => setAlertOpen(false);

  return (
    <div className="account-area">
      {/* <button
        type="button"
        className="login-btn"
        onClick={() => {
          navigate("/login");
        }}
      >
        로그인
      </button> */}

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
        <img src={""} alt={"사진"} className="acc-profile"></img>
        <span className="acc-name">계정명</span>
      </div>
    </div>
  );
};

export default LoginInfo;
