import axios from "axios";

const TELEGRAM_SERVER_URL = "http://localhost:8000/users/api/telegram/";

const modifyTgInfo = async (uid, token, bot_id) => {
  try {
    let dat = new FormData();
    dat.append("Token", token);
    dat.append("Chat_Id", bot_id);

    await axios.put(`${TELEGRAM_SERVER_URL}${uid}`, dat);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(false);
  }
};

export default modifyTgInfo;
