import {
  Button,
  Card,
  FormControl,
  Grid,
  Paper,
  RadioGroup,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

/**
 * 사용자 필터 선택에 대한 UI 컴포넌트 반환 함수
 * @param {any} props react props
 * @returns 사용자 필터 선택 라디오버튼 UI 컴포넌트
 */
const UserFilterList = (props) => {
  const filterList = props.filterList;
  const isSettings = props.isSettings;

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
            <RadioGroup>{filterList}</RadioGroup>
          </FormControl>
        </Paper>
        {/* 사용자 필터 라디오그룹 목록 영역 끝 */}
      </Card>
    </Grid>
  );
};

export default UserFilterList;
