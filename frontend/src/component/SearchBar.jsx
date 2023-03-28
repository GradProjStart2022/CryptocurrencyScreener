import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Autocomplete, TextField } from "@mui/material";

import getSearchComplete from "../logic/getAutocompleteArr.js";
import { searchConstValue } from "../model/search_const.js";
import searchEnterkeyHandle from "../logic/searchEnterkeyHandle.js";

/**
 * 검색창 UI 뱉어내는 함수
 * @param {any} props react props
 * @returns 검색창 UI
 */
const SearchBar = (props) => {
  const [searchStateVal, setSearchStateVal] = useState([]);
  const [userTypingDat, setUserTypingDat] = useState("");
  const [userClickedDat, setUserClickedDat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * getAutocompleteArr의 로직을 비동기로 실행해
     * 검색창의 setSearchStateVal 자동완성 요소 채우기
     * @param 없음
     */
    const asyncAutocomleteVar = async () => {
      getSearchComplete();
      setSearchStateVal(searchConstValue);
    };
    asyncAutocomleteVar();
  }, []);

  return (
    <div className="search-bar">
      <Autocomplete
        freeSolo // 검색 최적화 UI로 만들기
        // 자동선택값
        value={userClickedDat}
        onChange={(_, newClickVal) => {
          setUserClickedDat(newClickVal);
        }}
        // 타이핑
        inputValue={userTypingDat}
        onInputChange={(_, newInputVal) => {
          setUserTypingDat(newInputVal);
        }}
        // 검색 지정 옵션 값들
        options={searchStateVal}
        // 사용자 타이핑 렌더링
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            size="small"
            type="search"
            onKeyDown={(event) => {
              searchEnterkeyHandle(
                event,
                userTypingDat,
                userClickedDat,
                navigate
              );
            }}
          />
        )}
      />
    </div>
  );
};

export default SearchBar;
