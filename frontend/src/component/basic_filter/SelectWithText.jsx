import { useState } from "react";

import {
  Box,
  FormControl,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";

const SelectWithText = (props) => {
  const filterName = props.filterName;
  const selectMenu = props.selectMenu;
  const selectElem = [];
  selectMenu.forEach((elem) => {
    selectElem.push(<MenuItem value={elem}>{elem}</MenuItem>);
  });

  // 값쪽 셀렉트 임시로 체크하는 변수
  const [condition, setCondition] = useState("미만");
  const handleConditionChange = (event) => {
    setCondition(event.target.value);
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
        <span style={{ display: "flex", alignItems: "center" }}>
          <FormControl size="small">
            <Select
              value={condition}
              onChange={handleConditionChange}
              displayEmpty
            >
              {selectElem}
            </Select>
          </FormControl>
          <TextField variant="outlined" size="small" />
        </span>
      </Box>
    </Grid>
  );
};

export default SelectWithText;
