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
 * * 복합필터 목록(filter_list), 복합필터 상세 정보(filter_data) 보관
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

/**
 * basic_filter_name.csv 저장용 redux store
 *
 * abbreviation: API 전송용 기본 필터 약어
 *
 * name_kr: jsx 컴포넌트 표시용 한국어 이름
 *
 * name_en: 영어 이름
 *
 * type: 모달 표시용 타입(서술적, 기술적 2가지만 존재)
 */
let basicFilterName = createSlice({
  name: "basicFilterArr",
  initialState: {
    basicFilterArr: [],
  },
  reducers: {
    setFilterData: (state, action) => {
      state.basicFilterArr = action.payload;
    },
    addFilterData: (state, action) => {
      state.basicFilterArr.push(action.payload);
    },
    clearFilterData: (state) => {
      state.basicFilterArr = [];
    },
  },
});

export let { setFilterData, addFilterData, clearFilterData } =
  basicFilterName.actions;
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
    basicFilterName: basicFilterName.reducer,
  },
});
