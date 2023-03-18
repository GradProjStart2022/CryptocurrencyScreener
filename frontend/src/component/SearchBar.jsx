/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

const search_input_css = css({
  height: "4vh",
  maxHeight: "40px",
  width: "100%",
  textIndent: "33px",
  borderRadius: "24px",
  border: "1px solid #e6e7e7",
  backgroundColor: "#f0f3fa",
  "&:focus": {
    boxShadow: "none",
    border: "none",
  },
});

const 테스트용css = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

/**
 * 검색창 UI 뱉어내는 함수
 * @param {any} props react props
 * @returns 검색창 UI 요소
 */
const SearchBar = (props) => {
  const [inptDat, setInptDat] = useState("");

  let 옵션테스트배열 = [];
  for (let i = 1; i < 101; i++) {
    옵션테스트배열.push(`${i}`);
  }
  옵션테스트배열.push("ㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇ긴거하나넣기");

  return (
    <div className="search-bar">
      {/* <datalist id="드롭다운테스트">
        {옵션테스트배열.map((value) => {
          return <option>{value}</option>;
        })}
      </datalist>
      <input
        type="text"
        css={search_input_css}
        placeholder="찾으려는 암호화폐를 입력해 보세요..."
        list="드롭다운테스트"
        onInput={(event) => {
          const {
            target: { value },
          } = event;
          setInptDat(value);
        }}
      >
      </input> */}
      <Autocomplete
        value={inptDat}
        onInput={(event, value) => {
          console.log("event.target.value :>> ", event.target.value);
          // setInptDat(event.target.value);
          setInptDat(value);
          console.log("inptDat :>> ", inptDat);
        }}
        onChange={(event, value) => {
          console.log("event :>> ", event);
          console.log("value :>> ", value);
          // console.log("event.target.value :>> ", event.target.value);
          // var 잠시변수 = 옵션테스트배열[event.target.value];
          // console.log("잠시변수 :>> ", 잠시변수);

          // var 잠시변수 = JSON.parse(JSON.stringify(value));
          setInptDat(value);
          console.log("inptDat :>> ", inptDat);
        }}
        options={옵션테스트배열}
        renderInput={(params) => (
          <TextField {...params} label="Search" size="small" />
        )}
      />
    </div>
  );
};

export default SearchBar;
