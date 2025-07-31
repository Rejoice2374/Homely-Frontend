import Navbar from "../Navbar";
import { Box, useMediaQuery, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import UserWidget from "../widgets/UserWidget";
import UploadProperty from "../widgets/UploadProperty.jsx";
import Wishlist from "../widgets/WishlistWidget.jsx";
import WidgetWrapper from "../../components/WidgetWrapper";

const ProfilePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const user = useSelector((state) => state.user.user);
  const { picture } = user;

  return (
    <div>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        {/* User Widget */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget picture={picture} />
        </Box>

        {/* Feed Section */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <UploadProperty picture={picture} />
        </Box>

        {/* Whitelist Section */}
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <WidgetWrapper>
              <Wishlist />
            </WidgetWrapper>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default ProfilePage;
