import {
  Button,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  RadioGroup,
  Radio,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";

/**
 * 사용자 필터 선택에 대한 UI 컴포넌트 반환 함수
 * @param {any} props react props
 * @returns 사용자 필터 선택 라디오버튼 UI 컴포넌트
 */
const UserFilterList = (props) => {
  const userFilters = useSelector((state) => state.userFilter).filter_list;
  const isSettings = props.isSettings;
  const filterListClick = props.filterListClick;
  const setFilterListClick = props.setFilterListClick;

  const handleFilterCheck = (event) => {
    setFilterListClick(event.target.value);
  };

  // 복합필터 선택 폼: 사용자 복합필터의 라디오버튼
  let filterList = [];
  userFilters.forEach((value) => {
    filterList.push(
      <FormControlLabel
        key={value.id}
        value={value.id}
        control={<Radio />}
        label={value.name}
      />
    );
  });

  return (
    <Grid item xs={2}>
      <Card sx={{ height: "72vh" }}>
        {/* 제목 및 추가 버튼 영역 시작 */}
        <Typography variant="h6" component="div" sx={{ height: "20%" }}>
          <span
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            사용자
            {isSettings ? <br /> : " "}
            필터 목록
            {isSettings && (
              <Button variant="contained" size="small">
                <AddIcon fontSize="small" />
              </Button>
            )}
          </span>
        </Typography>
        {/* 제목 및 추가 버틑 영역 끝 */}
        {/* 사용자 필터 라디오그룹 목록 영역 시작 */}
        <Paper
          elevation={0}
          sx={{
            maxHeight: "80%",
            overflow: "auto",
            padding: "4px 8px 4px 8px",
          }}
        >
          <FormControl>
            <RadioGroup value={filterListClick} onChange={handleFilterCheck}>
              {filterList}
            </RadioGroup>
          </FormControl>
        </Paper>
        {/* 사용자 필터 라디오그룹 목록 영역 끝 */}
      </Card>
    </Grid>
  );
};

export default UserFilterList;
