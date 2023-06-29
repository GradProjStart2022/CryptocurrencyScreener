import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { ClickAwayListener } from "@mui/base";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash-es";
import setTgInfo from "../../logic/setTgInfo";
import modifyTgInfo from "../../logic/modifyTgInfo";

const TGModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "4vh 4vw 4vh 4vw",
  borderRadius: "4%",
  backgroundColor: "#ebecee",
};

const TGSettingsModal = (props) => {
  const isTgModalOpen = props.isTgModalOpen;
  // const handleTgModalOpen = props.handleTgModalOpen;
  const handleTgModalClose = props.handleTgModalClose;

  const tokenVal = props.tokenVal;
  const setTokenVal = props.setTokenVal;

  const botID = props.botID;
  const setBotID = props.setBotID;

  const uid = useSelector((state) => state.user.uid);

  const [isInit, setIsInit] = useState(false);

  // 초기에 봇 id, 토큰 모두 없으면 생성 상태로 판단
  useEffect(() => {
    if (isEmpty(botID) && isEmpty(tokenVal)) {
      setIsInit(true);
    }
  }, []);

  return (
    <Modal open={isTgModalOpen} onClose={handleTgModalClose}>
      <ClickAwayListener onClickAway={handleTgModalClose}>
        <Box sx={TGModalStyle}>
          <div>
            <span>
              <Typography variant="h6" component="h6">
                Token
              </Typography>
              <TextField
                size="small"
                value={tokenVal}
                onChange={(event) => {
                  setTokenVal(event.target.value);
                }}
              />
            </span>
          </div>
          <div
            style={{
              marginTop: "2vh",
            }}>
            <span>
              <Typography variant="h6" component="h6">
                Chatbot ID
              </Typography>
              <TextField
                size="small"
                value={botID}
                onChange={(event) => {
                  setBotID(event.target.value);
                }}
              />
            </span>
          </div>
          <div
            style={{
              marginTop: "4vh",
              display: "flex",
              justifyContent: "end",
            }}>
            <Button
              variant="outlined"
              onClick={() => {
                handleTgModalClose();
              }}>
              취소
            </Button>
            <Button
              variant="contained"
              sx={{ marginLeft: "1vw" }}
              onClick={async () => {
                try {
                  if (isInit) {
                    await setTgInfo(uid, tokenVal, botID);
                  } else {
                    await modifyTgInfo(uid, tokenVal, botID);
                  }
                  alert("저장되었습니다.");
                  handleTgModalClose();
                } catch (error) {
                  alert("텔레그램 정보 설정 중 문제가 발생했습니다.");
                }
              }}>
              확인
            </Button>
          </div>
        </Box>
      </ClickAwayListener>
    </Modal>
  );
};

export default TGSettingsModal;
