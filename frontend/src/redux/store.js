import { configureStore, createSlice } from "@reduxjs/toolkit";

/**
 * 사용자 정보 redux store
 * access_token, 이름, 이메일, 사용자 사진 보관
 * 사용자 기본 정보 redux store
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
 * 복합필터 목록(filter_list), 복합필터 상세 정보(filter_data) 보관
 */
let userFilter = createSlice({
  name: "userFilter",
  initialState: { filter_list: [], filter_data: [] },
  reducers: {
    // 필터 목록 값 변경
    setUserFilterList: (state, action) => {
      state.filter_list = action.payload;
    },
    // 필터 상세 정보 값 변경
    setUserFilterData: (state, action) => {
      state.filter_data = action.payload;
    },
    // 필터 상세 정보 값 추가
    addUserFilterData: (state, action) => {
      state.filter_data.push(action.payload);
    },
    // 사용자 필터 정보 삭제
    clearUserFilter: (state) => {
      state.filter_list = [];
      state.filter_data = [];
    },
  },
});

/**
 * 사용자 즐겨찾기 정보 redux store
 */
let userBookmark = createSlice({
  name: "userBookmark",
  initialState: { bookmarks: [] },
  reducers: {
    // 즐겨찾기 정보 값 변경
    setBookmark: (state, action) => {
      state.bookmarks = action.payload;
    },
    // 즐겨찾기 정보 추가
    addBookmark: (state, action) => {
      state.bookmarks.push(action.payload);
    },
    // 즐겨찾기 정보 삭제
    clearBookmark: (state) => {
      state.bookmarks = [];
    },
  },
});

// 사용자 필터 dispatcher
export let {
  setUserFilterList,
  setUserFilterData,
  addUserFilterData,
  clearUserFilter,
} = userFilter.actions;
// 사용자 기본 정보 dispatcher
export let { setToken, setAccname, setEmail, setImg, setUID, clearUser } =
  user.actions;
// 사용자 즐겨찾기 정보 dispatcher
export let { setBookmark, addBookmark, clearBookmark } = userBookmark.actions;
// reducer
export default configureStore({
  reducer: {
    user: user.reducer,
    userFilter: userFilter.reducer,
    userBookmark: userBookmark.reducer,
  },
});
