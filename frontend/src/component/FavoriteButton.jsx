import { memo } from "react";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const FavoriteButton = memo(({ isFavorite, handleBookmarkClick }) => {
  return (
    <IconButton
      aria-label="star"
      color="secondary"
      onClick={handleBookmarkClick}>
      {isFavorite ? <StarIcon /> : <StarBorderIcon />}
    </IconButton>
  );
});

export default FavoriteButton;
