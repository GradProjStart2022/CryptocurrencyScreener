import axios from "axios";
import userBookmark from "../redux/store.js";

const ATTENTION_URL = "http://localhost:8000/users/api/attention/";

// todo - 작업중
const addBookmark = async (user_email, crypname_kr, symbol, dispatch) => {
  let return_success = false;
  let resp;
  let attention_data = new FormData();
  attention_data
    .append("user", user_email)
    .append("cryptoname", crypname_kr)
    .append("symbol", symbol);
  try {
    resp = await axios.post(`${ATTENTION_URL}`, attention_data);

    if (resp.status === 200 || resp.status === 201 || resp.status === 201) {
      let data = resp.data;
      dispatch(userBookmark.actions.addBookmark(data));
      return_success = true;
    }
  } catch (error) {
    console.log("addBookmark error :>> ", error);
    return_success = false;
  } finally {
    return Promise.resolve(return_success);
  }
};

export default addBookmark;
