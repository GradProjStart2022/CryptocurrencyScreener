import { useState } from "react";
import { cloneDeep } from "lodash-es";

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

import SELECT_MENU_LIST from "../../model/const/SELECT_MENU_LIST.js"; // 전반부 셀렉트 내역(작음, 같음 등...)
import SELECT_MENU_OPER from "../../model/const/SELECT_MENU_OPER.js"; // 셀렉트 내역에 대한 연산자 기호( <, >, <>,...)

const INT_INPUT_PATTERN = { inputMode: "numeric", pattern: "-?[0-9]*" };

const SelectWithText = (props) => {
  const filterName = props.filterName; // 기본필터 이름
  // const SELECT_MENU_LIST = props.selectMenu;
  const userInputObj = props.valueObj; // 선택내역 핸들링용 object 배열 state
  const userInputSetter = props.valueSetter; // 선택내역 핸들링 state setter
  const componentIndex = props.idx; // object 배열 핸들링용 인덱스
  const selectElem = []; // 셀렉트 내역 컴포넌트 배열 변수
  SELECT_MENU_LIST.forEach((elem) => {
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
    let modify_input_obj = cloneDeep(userInputObj);
    if (event.target.checked) {
      modify_input_obj[componentIndex].is_used = true;
    } else {
      modify_input_obj[componentIndex].is_used = false;
      modify_input_obj[componentIndex].oper_kor = SELECT_MENU_LIST[0];
      modify_input_obj[componentIndex].oper = SELECT_MENU_OPER[0];
      modify_input_obj[componentIndex].value1 = 0;
      modify_input_obj[componentIndex].value2 = 0;
    }

    userInputSetter(modify_input_obj);
  };

  // 연산자 셀렉트 체크하는 변수
  const [condition, setCondition] = useState(SELECT_MENU_LIST[0]);
  /**
   * 연산자 셀렉트 변경 확인해 state의 연산자 및 핸들링 변수 변경하는 함수
   * @param {React.ChangeEvent<HTMLInputElement>} event html event
   */
  const handleConditionChange = (event) => {
    const {
      target: { value },
    } = event;
    setCondition(value);
    let modify_input_obj = cloneDeep(userInputObj);
    modify_input_obj[componentIndex].oper_kor = value;
    modify_input_obj[componentIndex].oper =
      SELECT_MENU_OPER[SELECT_MENU_LIST.indexOf(value)];
    userInputSetter(modify_input_obj);
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
    // 일단 입력값 역전 무시하고 저장
    let input_val = event.target.value;
    let modify_input_obj = cloneDeep(userInputObj);
    switch (is_single) {
      case true: // value1만 사용하는 경우
        setValue([input_val, 0]);
        modify_input_obj[componentIndex].value1 = input_val;
        modify_input_obj[componentIndex].is_dual_value = false;
        break;
      case false: // value2까지 사용하는 경우
        switch (index) {
          case 1: // value1 편집
            setValue([input_val, value[1]]);
            modify_input_obj[componentIndex].value1 = input_val;
            modify_input_obj[componentIndex].is_dual_value = true;
            break;
          case 2: // value2 편집
            setValue([value[0], input_val]);
            modify_input_obj[componentIndex].value2 = input_val;
            modify_input_obj[componentIndex].is_dual_value = true;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    userInputSetter(modify_input_obj);
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
        }}>
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
              displayEmpty>
              {selectElem}
            </Select>
          </FormControl>
          {/* 일부 연산자에 한해 value1, value2 동시 입력을 허용 */}
          {condition === SELECT_MENU_LIST[4] ||
          condition === SELECT_MENU_LIST[5] ? (
            // value1, value2 입력 텍스트필드
            <span style={{ display: "flex", alignItems: "center" }}>
              <TextField
                variant="outlined"
                size="small"
                sx={{ width: "4vw" }}
                type="text"
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
                type="text"
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
              type="text"
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
