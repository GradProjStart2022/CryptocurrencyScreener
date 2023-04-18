import { Grid, Typography, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const item_batch_css = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#ffffff",
};

/**
 * 복합필터를 편집할 때 나타나는
 * 해당 복합필터에 있는 기본필터들 표시용 UI 컴포넌트
 * todo: 삭제 및 순서변경 로직 추가해야 함 -> ABC표현식, 정보객체배열 등 같이 수정될 것 많음
 * @param {string} props react props
 * @returns 복합필터에 사용한 기본필터 UI 요소
 */
const BasicFilterComponent = (props) => {
  /** 기호(조건식 값: a, b, c, ...) */
  const code = props.code;
  /** 이름(기본필터 이름) */
  const name = props.name;
  /** 연산자(기호: <, =, 크로스업, ...) */
  const oper = props.oper;
  /** 설정값 1 */
  const value1 = props.value1;
  /** 설정값 2 */
  const value2 = props.value2;

  return (
    <Grid
      container
      spacing={0.5}
      sx={{
        height: "48px",
        backgroundColor: "#D9D9D9",
        margin: "1px 0px 1px -0px",
        border: "2px solid #444444",
      }}>
      {/* 기호 이름: A or B... 에서의 A, B */}
      <Grid item xs={1} sx={item_batch_css}>
        <Typography variant="body2" component="span">
          {code}
        </Typography>
      </Grid>
      {/* 기본필터 이름 */}
      <Grid item xs={4} sx={item_batch_css}>
        <Typography variant="body2" component="span">
          {name}
        </Typography>
      </Grid>
      {/* 연산자 */}
      <Grid item xs={2} sx={item_batch_css}>
        <Typography variant="body2" component="span">
          {oper}
        </Typography>
      </Grid>
      {/* 지정값: 값1만 있으면 값1만 표시, 값2가 있으면 값1 ~ 값2 로 표시 */}
      <Grid item xs={2} sx={item_batch_css}>
        <Typography variant="body2" component="span">
          {value2 === undefined ? value1 : `${value1} ~ ${value2}`}
        </Typography>
      </Grid>
      {/* 삭제버튼 */}
      <Grid item xs={1} sx={item_batch_css}>
        <IconButton size="small">
          <ClearIcon />
        </IconButton>
      </Grid>
      {/* 한칸 위로 이동 버튼 */}
      <Grid item xs={1} sx={item_batch_css}>
        <IconButton size="small">
          <ArrowUpwardIcon />
        </IconButton>
      </Grid>
      {/* 한칸 아래로 이동 버튼 */}
      <Grid item xs={1} sx={item_batch_css}>
        <IconButton size="small">
          <ArrowDownwardIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default BasicFilterComponent;
