import { Typography, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * 각 알람에 대해 알람 모달에 표시하는 UI 컴포넌트
 * @param {any} props react props
 * @returns 알람 단건 UI 요소
 */
const AlarmList = (props) => {
  const singleAlarm = props.singleAlarm;
  const handleDelete = props.handleDelete;

  return (
    <Paper
      key={singleAlarm.id}
      sx={{
        my: 1,
        mx: 1,
        p: 3,
        display: "flex",
        justifyContent: "space-between",
      }}
      elevation={3}>
      {/* <Typography variant="h6">{singleAlarm.filterName}</Typography> */}
      <Typography variant="body1">{singleAlarm?.message}</Typography>
      <IconButton
        color="secondary"
        size="small"
        sx={{
          display: "flex",
          justifyContent: "end",
        }}
        onClick={() => {
          handleDelete(singleAlarm.id);
        }}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </Paper>
  );
};

export default AlarmList;
