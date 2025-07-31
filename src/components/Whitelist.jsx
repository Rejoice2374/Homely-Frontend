import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Typography, IconButton, Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setWhitelists } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";

const Whitelist = ({ whitelistUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user.user);
  const whitelists = currentUser.whitelists || [];

  const { palette } = theme;
  const primaryLight = palette.primary.light;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isWhitelisted = whitelists.some(
    (user) => user._id === whitelistUser._id
  );

  const patchWhitelist = async () => {
    const response = await fetch(
      `https://homely-api.vercel.app//api/user/me/${whitelistUser._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setWhitelists({ whitelists: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={whitelistUser.picture} size="55px" />
        <Box
          onClick={() => navigate(`/profile/${whitelistUser._id}`)}
          sx={{ cursor: "pointer" }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{ "&:hover": { color: palette.primary.light } }}
          >
            {whitelistUser.Firstname} {whitelistUser.Lastname}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {whitelistUser.email}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={patchWhitelist}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isWhitelisted ? (
          <PersonRemoveOutlined sx={{ color: main }} />
        ) : (
          <PersonAddOutlined sx={{ color: main }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Whitelist;
