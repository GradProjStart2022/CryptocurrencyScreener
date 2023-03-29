import { useState } from "react";

import {
  Box,
  FormControl,
  Grid,
  Typography,
  Checkbox,
  Select,
  MenuItem,
  ListItemText,
} from "@mui/material";

/**
 * 여러 개를 체크하는 선택에 대한 기본 필터 선택 UI 컴포넌트 반환 함수
 * @param {any} props react props
 * @returns 체크하는 필터 선택 요소 UI 반환
 */
const CheckWithSelect = (props) => {
  const filterName = props.filterName;
  /** 셀렉트 내부에서 나타나는 필터들 이름 */
  const checkList = props.checkList;

  /** 셀렉트 값 저장용 변수 */
  const [filterNames, setFilterNames] = useState([]);
  const handleFilterNames = (event) => {
    const {
      target: { value },
    } = event;
    setFilterNames(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Grid item xs={6} sx={{ height: "48px" }}>
      <Box
        sx={{
          height: "48px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" component="span">
          {filterName}
        </Typography>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            width: "40%",
          }}
        >
          <FormControl size="small" sx={{ width: "100%" }}>
            <Select
              value={filterNames}
              onChange={handleFilterNames}
              renderValue={(selected) => selected.join(", ")}
              multiple
              displayEmpty
              sx={{ width: "100%" }}
            >
              {checkList.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={filterNames.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </span>
      </Box>
    </Grid>
  );
};

export default CheckWithSelect;
