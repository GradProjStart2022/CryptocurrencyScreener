import axios from "axios";
import { setUID } from "../redux/store.js";

const SERVER_GET_UID = `${process.env.REACT_APP_API_ROOT}/users/api/list/`;

/**
 * 사용자 이메일 주소 받아서 UID 받는 함수
 * @param {string} email 사용자 이메일 주소
 * @param {Dispatch<AnyAction>} dispatch RTK Dispatcher
 * @returns {Promise<boolean>} 성공여부 + promise 객체
 */
const getServerUID = (email, dispatch) => {
  let return_success = true;

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
      return_success = false;
    });

  return Promise.resolve(return_success);
};

export default getServerUID;
