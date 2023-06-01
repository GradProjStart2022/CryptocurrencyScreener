import {
  TableCell,
  TableRow,
  Switch,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

/**
 * 복합필터에 대한 알람 열 요소 반환 함수
 * @param {any} props react props
 * @returns 알람 설정 열 UI 컴포넌트
 */
const AlarmTableRow = ({
  notification,
  selectValues,
  handleSelectChange,
  switchStates,
  handleSwitchChange,
  setIsModify,
}) => {
  return (
    <TableRow key={notification.id}>
      <TableCell sx={{ pl: 5 }}>{notification.name}</TableCell>
      <TableCell align="right">
        <FormControl>
          <InputLabel id={`select-label-${notification.id}`}>
            알림간격
          </InputLabel>
          <Select
            labelId={`select-label-${notification.id}`}
            value={selectValues[notification.id]}
            onChange={handleSelectChange(notification.id)}
            label="알림간격"
            sx={{ width: 90 }}>
            <MenuItem value={30}>30분</MenuItem>
            <MenuItem value={60}>1시간</MenuItem>
            <MenuItem value={240}>4시간</MenuItem>
            <MenuItem value={1}>1일</MenuItem>
          </Select>
        </FormControl>
      </TableCell>
      <TableCell align="right">
        <Switch
          checked={switchStates[`website-${notification.id}`]}
          onChange={handleSwitchChange(notification.id, "website", setIsModify)}
        />
      </TableCell>
      <TableCell align="right">
        <Switch
          checked={switchStates[`telegram-${notification.id}`]}
          onChange={handleSwitchChange(
            notification.id,
            "telegram",
            setIsModify
          )}
        />
      </TableCell>
    </TableRow>
  );
};

export default AlarmTableRow;
