import axios from "axios";
import { setUID } from "../redux/store.js";

const SERVER_GET_UID = "http://127.0.0.1:8000/users/api/list/";

const getServerUID = (email, dispatch) => {
  axios
    .get(`${SERVER_GET_UID}?email=${email}`)
    .then((resp) => {
      let uid = resp.data.id;
      console.log("getServerUID uid :>> ", uid);
      dispatch(setUID(uid));
    })
    .catch((error) => {
      console.log("getServerUID error :>> ", error);
      dispatch(setUID(-1));
    });
};

export default getServerUID;
