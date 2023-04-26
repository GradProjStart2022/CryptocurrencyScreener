import { configureStore, createSlice } from "@reduxjs/toolkit";

/**
 * 사용자 정보 redux store
 * access_token, 이름, 이메일, 사용자 사진 보관
 */
let user = createSlice({
  name: "user",
  initialState: {
    access_token: "",
    accname: "계정명",
    email: "",
    img: "사진",
    uid: -1,
  },
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
    // 계정 UID 변경
    setUID: (state, action) => {
      state.uid = action.payload;
    },
    // 사용자 정보 삭제
    clearUser: (state) => {
      state.access_token = "";
      state.accname = "";
      state.email = "";
      state.accimg = "";
      state.uid = -1;
      localStorage.removeItem("refresh_token");
    },
  },
});

/**
 * 사용자 필터 정보 redux store
 */
let userFilter = createSlice({
  name: "userFilter",
  initialState: { filter_list: [], filter_data: [] },
  reducers: {
    setUserFilterList: (state, action) => {
      state.filter_list = action.payload;
    },
    setUserFilterData: (state, action) => {
      state.filter_data = action.payload;
    },
    addUserFilterData: (state, action) => {
      state.filter_data.push(action.payload);
    },
    clearUserFilter: (state) => {
      state.filter_list = [];
      state.filter_data = [];
    },
  },
});

export let {
  setUserFilterList,
  setUserFilterData,
  addUserFilterData,
  clearUserFilter,
} = userFilter.actions;
export let { setToken, setAccname, setEmail, setImg, setUID, clearUser } =
  user.actions;
export default configureStore({
  reducer: {
    user: user.reducer,
    userFilter: userFilter.reducer,
  },
});
