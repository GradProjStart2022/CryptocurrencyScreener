import axios from "axios";
import { addBookmark } from "../redux/store.js";

const ATTENTION_URL = "http://localhost:8000/users/api/attention/";

// todo - 작업중
const addBookmarkServer = async (user_email, crypname_kr, symbol, dispatch) => {
  let return_success = false;
  let resp;
  let attention_data = new FormData();
  attention_data.append("user", user_email);
  attention_data.append("cryptoname", crypname_kr);
  attention_data.append("symbol", symbol);
  try {
    console.log(user_email);
    console.log(crypname_kr);
    console.log(symbol);
    resp = await axios.post(`${ATTENTION_URL}`, attention_data);

    if (resp.status === 200 || resp.status === 201) {
      let data = resp.data;
      dispatch(addBookmark(data));
      return_success = true;
    }
  } catch (error) {
    console.log("addBookmark error :>> ", error);
    return_success = false;
  } finally {
    return Promise.resolve(return_success);
  }
};

export default addBookmarkServer;
