import axios from "axios";

const TELEGRAM_SERVER_URL = "http://localhost:8000/users/api/telegram/";

const setTgInfo = async (uid, token, bot_id) => {
  try {
    let dat = new FormData();
    dat.append("user", uid);
    dat.append("Token", token);
    dat.append("Chat_Id", bot_id);

    await axios.post(`${TELEGRAM_SERVER_URL}`, dat);
    return Promise.resolve(true);
  } catch (error) {
    console.log("error :>> ", error);
    return Promise.reject(false);
  }
};

export default setTgInfo;
