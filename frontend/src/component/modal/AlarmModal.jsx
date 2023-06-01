import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Modal, Box, ClickAwayListener } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import getAlarm from "../../logic/getAlarm.js";
import readAlarm from "../../logic/readAlarm.js";

import AlarmList from "../AlarmList.jsx";

// dummy data
// const notifications2 = [];
const notifications2 = [
  {
    id: 2,
    message: "1234",
    is_read: false,
    user: 2,
    created_at: "2023-05-15 07:21:56.287729+00:00",
  },
  {
    id: 3,
    message:
      "1234이녀석은충분히긴내용을포함한도고생각합니다그래서이녀넉의개행을알아보고잘합니다",
    is_read: false,
    user: 2,
    created_at: "2023-05-15 07:21:56.287729+00:00",
  },
];

// 알람 모달 css
const alarmModalStyle = {
  // 레이아웃 css
  position: "absolute",
  top: "8%",
  left: "70%",
  width: "20%",
  height: "40%",
  backgroundColor: "#ffffff",
  overflow: "auto",
  borderRadius: 3,

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

/**
 * 로그인 상태에서 알람 모달을 표시하는 UI 컴포넌트
 * @param {any} props react props
 * @returns 알람 모달 UI 요소
 */
const AlarmModal = (props) => {
  const isAlertOpen = props.isAlertOpen;
  const handleAlertOpen = props.handleAlertOpen;
  const handleAlertClose = props.handleAlertClose;

  const uid = useSelector((state) => state.user.uid);

  // 알람 목록 state
  const [alarmState, setAlarmState] = useState([]);

  /**
   * 각 알람에 대해 읽음 처리하고 새 알람 상태 받아오는 콜백 로직
   * @param {number} alarm_id 알람ID
   */
  const handleDelete = (alarm_id) => {
    let rslt = false;
    do {
      rslt = readAlarm(alarm_id);
    } while (!rslt);
    do {
      rslt = getAlarm(uid, setAlarmState);
    } while (!rslt);
  };

  // 사용자 ID 변화시 알람 새로 가져옴
  useEffect(() => {
    // setAlarmState(cloneDeep(notifications2));
    if (uid !== -1) {
      let rslt = false;
      do {
        rslt = getAlarm(uid, setAlarmState);
      } while (!rslt);
    }
  }, [uid]);

  return (
    <div className="user-noti" onClick={handleAlertOpen}>
      <NotificationsNoneIcon />
      <Modal open={isAlertOpen} onClose={handleAlertClose}>
        <ClickAwayListener onClickAway={handleAlertClose}>
          <Box sx={alarmModalStyle}>
            {alarmState.length > 0 ? (
              alarmState.map((elem) => {
                return (
                  <AlarmList
                    singleAlarm={elem}
                    setAlarmState={setAlarmState}
                    handleDelete={handleDelete}
                  />
                );
              })
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <p>
                  새로운
                  <br />
                  알람이 없습니다
                </p>
              </div>
            )}
          </Box>
        </ClickAwayListener>
      </Modal>
    </div>
  );
};

export default AlarmModal;
