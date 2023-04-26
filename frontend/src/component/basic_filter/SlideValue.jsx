import { useState } from "react";

import {
  Box,
  Grid,
  TextField,
  Typography,
  Slider,
  Checkbox,
} from "@mui/material";

const SlideValue = (props) => {
  const filterName = props.filterName;
  /** 슬라이더 구간 변수 */
  const minDistance = props.minDist;
  const valStart = props.valStart;
  const valEnd = props.valEnd;
  const [sliderVal, setSliderVal] = useState([valStart, valEnd]);

  const handleSliderChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setSliderVal([
        Math.min(newValue[0], sliderVal[1] - minDistance),
        sliderVal[1],
      ]);
    } else {
      setSliderVal([
        sliderVal[0],
        Math.max(newValue[1], sliderVal[0] + minDistance),
      ]);
    }
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
        <Checkbox />
        <Typography variant="body2" component="span">
          {filterName}
        </Typography>
        <span
          style={{
            maxWidth: "50%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            value={sliderVal[0]}
            inputProps={{ readOnly: true }}
          />
          <Slider
            value={sliderVal}
            onChange={handleSliderChange}
            valueLabelDisplay="off"
            disableSwap
          />
          <TextField
            size="small"
            value={sliderVal[1]}
            inputProps={{ readOnly: true }}
          />
        </span>
      </Box>
    </Grid>
  );
};

export default SlideValue;
