import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import defaultImage from "../../assets/default.jpg";
import { setWishlist } from "../../state";
import Navbar from "../Navbar";
import Wishlist from "../widgets/WishlistWidget.jsx";
import WidgetWrapper from "../../components/WidgetWrapper";

const PropertyDetails = () => {
  const { palette } = useTheme();
  const { propertyId } = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const wishlist = useSelector((state) => state.wishlist);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // Add media query for non-mobile screens
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const wishlistIds = useMemo(
    () => wishlist.map((item) => (typeof item === "string" ? item : item._id)),
    [wishlist]
  );
  const isWishlisted = wishlistIds.includes(propertyId);

  const fetchProperty = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/property/${propertyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setProperty(data);
    } catch (err) {
      console.error("Error fetching property:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async () => {
    try {
      const endpoint = isWishlisted
        ? `http://localhost:3001/api/wishlist/remove/${propertyId}`
        : "http://localhost:3001/api/wishlist/add";
      const method = isWishlisted ? "DELETE" : "POST";
      const body = method === "POST" ? JSON.stringify({ propertyId }) : null;

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      });

      if (res.ok) {
        const updatedWishlist = await res.json();
        dispatch(setWishlist(updatedWishlist));
        setSnackbar({
          open: true,
          message: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
          severity: "success",
        });
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      setSnackbar({
        open: true,
        message: "Wishlist update failed",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]); //eslint-disable-line react-hooks/exhaustive-deps

  if (loading)
    return <CircularProgress sx={{ margin: "2rem auto", display: "block" }} />;
  if (!property)
    return <Typography textAlign="center">Property not found.</Typography>;

  return (
    <>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        justifyContent="space-between"
      >
        <Box p="1rem" width={isNonMobileScreens ? "66%" : undefined}>
          <Box>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              {property.propertyName}
            </Typography>
          </Box>

          {/* Image Gallery */}
          <Box mt={2}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={true}
              centeredSlides={true}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              spaceBetween={20}
              slidesPerView={1}
              style={{
                width: "100%",
                maxWidth: "100%", // Ensure it doesn't overflow
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {(property.propertyImages?.length
                ? property.propertyImages
                : [defaultImage]
              ).map((img, index) => (
                <SwiperSlide key={index}>
                  <Box
                    component="img"
                    src={img}
                    alt={`Property image ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          <Box
            display={"flex"}
            alignItems="center"
            justifyContent={"space-between"}
          >
            {/* Property Details */}
            <Box mt={2}>
              <Typography color={palette.neutral.medium}>
                {property.propertyType} · {property.propertyLocation}
              </Typography>
              <Typography variant="h6" color={palette.primary.main}>
                ${property.propertyPrice.toLocaleString()}
              </Typography>
              <Typography mt={1}>{property.propertyDescription}</Typography>
              <Typography mt={1} color={palette.neutral.medium}>
                Listed by: {property.agentName || "Unknown Agent"}
              </Typography>
              <Typography color={palette.neutral.medium}>
                Contact: {property.agentContact || "No contact provided"}
              </Typography>
              <Typography color={palette.neutral.medium}>
                Listed on: {new Date(property.createdAt).toLocaleDateString()}
              </Typography>
              <Typography color={palette.neutral.medium}>
                Lease Type: {property.leaseType || "N/A"}
              </Typography>
              <Typography color={palette.neutral.medium}>
                Lease Duration: {property.leaseDuration || "N/A"}
              </Typography>
            </Box>

            <Box mt={2}>
              <Button variant="contained">
                {property.leaseType === "sale" ? "Buy" : "Rent"}
              </Button>
            </Box>
          </Box>

          {/* Wishlist Button */}
          <Box mt={2}>
            <IconButton onClick={toggleWishlist}>
              {isWishlisted ? (
                <FavoriteOutlined sx={{ color: palette.neutral.text }} />
              ) : (
                <FavoriteBorderOutlined sx={{ color: palette.neutral.text }} />
              )}
            </IconButton>
            <Typography component="span">
              {Object.keys(property.wishlistedBy || {}).length} wishlisted
            </Typography>
          </Box>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              severity={snackbar.severity}
              sx={{ width: "100%" }}
              onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>

        {/* Whitelist Section */}
        {isNonMobileScreens && (
          <Box width="28%">
            <WidgetWrapper>
              <Wishlist />
            </WidgetWrapper>
          </Box>
        )}
      </Box>
    </>
  );
};

export default PropertyDetails;
