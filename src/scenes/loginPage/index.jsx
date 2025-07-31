import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      {/* Header */}
      <Box
        width="100%"
        p="1rem 6%"
        textAlign="center"
        bgcolor={theme.palette.background.default}
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          <AccountBalanceIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Homely
        </Typography>
      </Box>

      {/* Form Container */}
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        bgcolor={theme.palette.background.default}
      >
        <Typography variant="h4" fontWeight="bold" mb="1rem" textAlign="center">
          Welcome to Homely, the place where you can find your dream home!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
