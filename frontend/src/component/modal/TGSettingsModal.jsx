import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { ClickAwayListener } from "@mui/base";
import { useState } from "react";

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
  const handleTgModalOpen = props.handleTgModalOpen;
  const handleTgModalClose = props.handleTgModalClose;

  const [tokenVal, setTokenVal] = useState("");
  const [botID, setBotID] = useState("");

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
            <Button variant="contained" sx={{ marginLeft: "1vw" }}>
              확인
            </Button>
          </div>
        </Box>
      </ClickAwayListener>
    </Modal>
  );
};

export default TGSettingsModal;
