import { configureStore, createSlice } from "@reduxjs/toolkit";

/**
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
  initialState: { bookmarks: [], isFavorite: false },
  reducers: {
    // 즐겨찾기 정보 값 변경
    setBookmark: (state, action) => {
      state.bookmarks = action.payload;
    },
    // 즐겨찾기 정보 추가
    addBookmark: (state, action) => {
      if (state.bookmarks.length === 3) {
        // 이미 3개 차 있으면 서버 로직과 같이 맨 앞 요소 제거
        state.bookmarks.splice(0, 1);
      }
      state.bookmarks.push(action.payload);
    },
    // 즐겨찾기 정보 전체 삭제
    clearBookmark: (state) => {
      state.bookmarks = [];
    },
    setIsFavorite: (state, action) => {
      state.isFavorite = action.payload;
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

// 기본 필터 정보 dispatcher
export let { setFilterData, addFilterData, clearFilterData } =
  basicFilterName.actions;
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
export let { setBookmark, addBookmark, clearBookmark, setIsFavorite } =
  userBookmark.actions;
// reducer
export default configureStore({
  reducer: {
    user: user.reducer,
    userFilter: userFilter.reducer,
    userBookmark: userBookmark.reducer,
    basicFilterName: basicFilterName.reducer,
  },
});
