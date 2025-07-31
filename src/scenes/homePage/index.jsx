import Navbar from "../Navbar";
import { Box, Typography, useTheme } from "@mui/material";
import PropertyList from "../widgets/PropertyList";

const HomePage = () => {
  const { palette } = useTheme();
  const text = palette.neutral.text;

  return (
    <div>
      <Navbar />
      {/* Home page */}
      <Box
        container
        padding="2rem 6%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="0.5rem"
        justifyContent="space-between"
      >
        {/* Welcome to homely banner */}
        <Box
          width="100%"
          padding="1rem"
          display="flex"
          borderRadius="0.55rem"
          backgroundColor={text}
          textAlign="center"
          justifyContent="center"
          boxShadow="0 2px 4px rgba(0,0,0,0.1)"
          sx={{
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            },
          }}
        >
          <Box>
            <h1>Welcome to Homely</h1>
            <p>Your one-stop solution for all property needs.</p>
            <p>Explore properties, manage listings, and connect with agents.</p>
          </Box>
        </Box>
        {/* Property List Widget */}
        <Box width="100%" mt="2rem">
          <PropertyList />
          <Typography variant="h5" mt={2} textAlign="center">
            Explore our latest properties and find your dream home!
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default HomePage;
