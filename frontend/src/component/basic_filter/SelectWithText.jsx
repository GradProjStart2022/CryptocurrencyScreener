import { useState } from "react";

import {
  Box,
  FormControl,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";

const INT_INPUT_PATTERN = { inputMode: "numeric", pattern: "-?[0-9]*" };

const SelectWithText = (props) => {
  const filterName = props.filterName; // 기본필터 이름
  const selectMenu = props.selectMenu; // 전반부 셀렉트 내역(작음, 같음 등...)
  const userInputObj = props.valueObj; // 선택내역 핸들링용 object 배열 state
  const userInputSetter = props.valueSetter; // 선택내역 핸들링 state setter
  const componentIndex = props.idx; // object 배열 핸들링용 인덱스
  const selectElem = []; // 셀렉트 내역 컴포넌트 배열 변수
  selectMenu.forEach((elem) => {
    selectElem.push(
      <MenuItem key={props.customKey} value={elem}>
        {elem}
      </MenuItem>
    );
  });

  /**
   * 해당 필터 컴포넌트 사용 여부를 체크해 핸들링 변수 세팅하는 함수
   * @param {React.ChangeEvent<HTMLInputElement>} event html event
   */
  const handleCheck = (event) => {
    let modify_input_obj = JSON.parse(JSON.stringify(userInputObj));
    if (event.target.checked) {
      modify_input_obj[componentIndex].is_used = true;
    } else {
      modify_input_obj[componentIndex].is_used = false;
      modify_input_obj[componentIndex].oper_kor = selectMenu[0];
      modify_input_obj[componentIndex].value1 = 0;
      modify_input_obj[componentIndex].value2 = 0;
    }

    userInputSetter(modify_input_obj);
  };

  // 연산자 셀렉트 체크하는 변수
  const [condition, setCondition] = useState(selectMenu[0]);
  /**
   * 연산자 셀렉트 변경 확인해 state 및 핸들링 변수 변경하는 함수
   * @param {React.ChangeEvent<HTMLInputElement>} event html event
   */
  const handleConditionChange = (event) => {
    setCondition(event.target.value);
    let modify_input_obj = JSON.parse(JSON.stringify(userInputObj));
    modify_input_obj[componentIndex].oper_kor = event.target.value;
  };

  // value1, value2 체크하는 변수
  const [value, setValue] = useState([0, 0]);
  /**
   * 숫자 입력값 변경 확인해 state 및 value1, value2 변경하는 함수
   * @param {React.ChangeEvent<HTMLInputElement>} event html event
   * @param {number} index value1인지, value2인지 체크하는 변수
   * @param {boolean} is_single value1 단독 사용 상태인지, value2 동시 사용인지 체크하는 변수
   */
  const handleValueChange = (event, index, is_single) => {
    let input_val = event.target.value;
    switch (is_single) {
      case true:
        setValue([input_val, 0]);
        break;
      case false:
        switch (index) {
          case 1:
            if (input_val > value[1]) {
              setValue([value[1], input_val]);
            } else {
              setValue([input_val, value[1]]);
            }
            break;
          case 2:
            if (input_val < value[0]) {
              setValue([input_val, value[0]]);
            } else {
              setValue([value[0], input_val]);
            }
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  return (
    <Grid item xs={6} sx={{ height: "48px" }}>
      <Box
        sx={{
          height: "48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0px 4px 0px 4px",
        }}
      >
        {/* 필터 사용되는지 체크하는 박스 */}
        <Checkbox
          value={userInputObj[componentIndex].is_used}
          onChange={(event) => {
            handleCheck(event);
          }}
        />
        {/* 필터 이름 */}
        <Typography variant="body2" component="span">
          {filterName}
        </Typography>
        <span style={{ display: "flex", alignItems: "center" }}>
          {/* 필터 연산자 셀렉트 */}
          <FormControl size="small">
            <Select
              value={condition}
              onChange={handleConditionChange}
              displayEmpty
            >
              {selectElem}
            </Select>
          </FormControl>
          {/* 일부 연산자에 한해 value1, value2 동시 입력을 허용 */}
          {condition === selectMenu[4] || condition === selectMenu[5] ? (
            // value1, value2 입력 텍스트필드
            <span style={{ display: "flex", alignItems: "center" }}>
              <TextField
                variant="outlined"
                size="small"
                sx={{ width: "4vw" }}
                inputProps={INT_INPUT_PATTERN}
                onChange={(event) => {
                  handleValueChange(event, 1, false);
                }}
              />
              <span style={{ margin: "0px 8px 0px 8px" }}> — </span>
              <TextField
                variant="outlined"
                size="small"
                sx={{ width: "4vw" }}
                inputProps={INT_INPUT_PATTERN}
                onChange={(event) => {
                  handleValueChange(event, 2, false);
                }}
              />
            </span>
          ) : (
            // value1 입력 텍스트필드
            <TextField
              variant="outlined"
              size="small"
              sx={{ width: "12vw" }}
              inputProps={INT_INPUT_PATTERN}
              onChange={(event) => {
                handleValueChange(event, 1, true);
              }}
            />
          )}
        </span>
      </Box>
    </Grid>
  );
};

export default SelectWithText;
