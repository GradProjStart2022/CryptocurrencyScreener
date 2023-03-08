import { configureStore, createSlice } from "@reduxjs/toolkit";

/**
 * 사용자 정보 redux store
 * access_token(, 이메일, 사용자 사진) 보관
 */
let user = createSlice({
  name: "user",
  initialState: { access_token: "", accname: "계정명", email: "", img: "사진" },
  reducers: {
    // access_token 값 변경
    setToken: (state, action) => {
      state.access_token = action.payload;
    },
    // 계정 이름 변경
    setAccname: (state, action) => {
      state.accname = action.payload;
    },
    // 계정 이메일 변경
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    // 계정 이미지 URL 변경
    setImg: (state, action) => {
      state.accimg = action.payload;
    },
    // 사용자 정보 삭제
    clearUser: (state) => {
      state.access_token = "";
      state.accname = "";
      state.email = "";
      state.accimg = "";
      localStorage.removeItem("refresh_token");
    },
  },
});

export let { setToken, setAccname, setEmail, setImg, clearUser } = user.actions;
export default configureStore({
  reducer: {
    user: user.reducer,
  },
});
