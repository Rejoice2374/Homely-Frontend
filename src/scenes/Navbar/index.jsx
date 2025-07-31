import { useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import {
  Search,
  FavoriteOutlined,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"; // fixed icon import
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMode, setLogout } from "../../state"; // fixed import path
import FlexBetween from "../../components/FlexBetween";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ fixed capitalization
  const user = useSelector((state) => state.user.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  // const neutralLight = theme.palette.neutral.light;
  const secondaryText = theme.palette.secondary.text; // fixed variable name
  const neutralDark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  // const primaryLight = theme.palette.primary.light;
  const neutralText = theme.palette.neutral.text; // fixed variable name
  const alt = theme.palette.background.alt;

  const fullName = user ? `${user.Firstname} ${user.Lastname}` : ""; // ✅ fallback
  const userPicture = user ? user.picture : ""; // ✅ fallback

  const handleChange = (event) => {
    const value = event.target.value;
    if (value === "profile") {
      navigate(`/profile/${user._id}`);
    } else if (value === "logout") {
      dispatch(setLogout());
    }
  };

  const UserMenu = (
    <FormControl variant="standard">
      <Select
        value=""
        displayEmpty
        onChange={handleChange}
        sx={{
          backgroundColor: neutralText,
          width: "180px",
          borderRadius: "0.25rem",
          p: "0.25rem 1rem",
          "& .MuiSvgIcon-root": {
            pr: "0.25rem",
            width: "3rem",
          },
          "& .MuiSelect-select:focus": {
            backgroundColor: neutralText,
          },
        }}
        input={<InputBase />}
        renderValue={() => (
          <Box display="flex" alignItems="center" gap="0.5rem">
            {userPicture && (
              <Avatar
                alt={fullName}
                src={userPicture}
                sx={{ width: 24, height: 24 }}
              />
            )}
            <Typography fontSize="0.9rem" fontWeight="500">
              {fullName}
            </Typography>
          </Box>
        )}
      >
        <MenuItem value="profile">Profile</MenuItem>
        <MenuItem value="logout">Log Out</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      {/* Left Side */}
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color={secondaryText}
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: secondaryText,
              cursor: "pointer",
            },
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <AccountBalanceIcon />
          Homely
        </Typography>

        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralText}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* Right Side */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: neutralDark, fontSize: "25px" }} />
            )}
          </IconButton>
          <FavoriteOutlined
            onClick={() => navigate("/wishlist")}
            sx={{ fontSize: "25px" }}
          />
          <Notifications sx={{ fontSize: "25px" }} />
          <Help sx={{ fontSize: "25px" }} />
          {UserMenu}
        </FlexBetween>
      ) : (
        <IconButton onClick={() => setToggleMenu(!toggleMenu)}>
          <Menu />
        </IconButton>
      )}

      {/* Mobile Nav */}
      {!isNonMobileScreens && toggleMenu && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          minWidth="250px"
          maxWidth="300px"
          backgroundColor={background}
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton onClick={() => setToggleMenu(!toggleMenu)}>
              <Close />
            </IconButton>
          </Box>
          <FlexBetween
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: neutralDark, fontSize: "25px" }} />
              )}
            </IconButton>
            <FavoriteOutlined sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            {UserMenu}
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
