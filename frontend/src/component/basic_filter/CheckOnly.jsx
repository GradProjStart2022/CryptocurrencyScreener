import { Box, Grid, Typography, Checkbox } from "@mui/material";

const CheckOnly = (props) => {
  const filterName = props.filterName;

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
        <Checkbox />
      </Box>
    </Grid>
  );
};

export default CheckOnly;
