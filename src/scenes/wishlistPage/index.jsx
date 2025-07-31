import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  FavoriteOutlined,
  FavoriteBorderOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setWishlist, setProperties } from "../../state";
import { useNavigate } from "react-router-dom";
import UserImage from "../../components/UserImage";
import defaultImage from "../../assets/default.jpg";

const WishlistPage = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token);
  const wishlist = useSelector((state) => state.wishlist || []);
  const properties = useSelector((state) => state.properties || []);

  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // Fetch wishlist properties from backend
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://homely-api.vercel.app/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      dispatch(setWishlist(data));
      setLoading(false);
    } catch {
      setLoading(false);
      setSnackbarMessage("Failed to fetch wishlist.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleWishlistToggle = async (propertyId) => {
    const isWishlisted = wishlist.some((item) => item._id === propertyId);
    try {
      const endpoint = isWishlisted
        ? `https://homely-api.vercel.app/api/wishlist/remove/${propertyId}`
        : "https://homely-api.vercel.app/api/wishlist/add";
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

        // Also update properties locally to keep UI consistent
        dispatch(
          setProperties({
            properties: properties.map((prop) =>
              prop._id === propertyId
                ? {
                    ...prop,
                    wishlistedBy: isWishlisted
                      ? { ...prop.wishlistedBy, [user._id]: undefined }
                      : { ...prop.wishlistedBy, [user._id]: true },
                  }
                : prop
            ),
          })
        );

        setSnackbarMessage(
          isWishlisted ? "Removed from wishlist" : "Added to wishlist"
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch {
      setSnackbarMessage("Failed to update wishlist.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />
      <Box p={2}>
        <Typography variant="h4" mb={2} textAlign="center">
          Your Wishlist
        </Typography>

        {wishlist.length === 0 ? (
          <Typography textAlign="center" mt={4}>
            You have no properties in your wishlist.
          </Typography>
        ) : (
          <Grid container spacing={2} columns={{ xs: 2, sm: 8, md: 12 }}>
            {wishlist.map((prop) => {
              const wishlistCount = Object.keys(prop.wishlistedBy || {}).length;
              return (
                <Grid size={{ xs: 2, sm: 4, md: 4 }} key={prop._id}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardHeader
                      avatar={
                        <UserImage
                          image={prop.agentImage || defaultImage}
                          size="40px"
                        />
                      }
                      title={
                        <Typography
                          variant="h6"
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/profile/${prop.userId || user._id}`)
                          }
                        >
                          {prop.agentName}
                        </Typography>
                      }
                      subheader={new Date(prop.createdAt).toLocaleDateString()}
                    />
                    <CardMedia
                      component="img"
                      height="194"
                      image={prop.propertyImages?.[0] || defaultImage}
                      alt={prop.propertyName}
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/property/${prop._id}`)}
                    />
                    <CardContent>
                      <Typography variant="h6">{prop.propertyName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {prop.propertyType} · {prop.propertyLocation}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                        ${prop.propertyPrice?.toLocaleString()}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                        width="100%"
                      >
                        <IconButton
                          aria-label="toggle wishlist"
                          onClick={() => handleWishlistToggle(prop._id)}
                        >
                          <FavoriteOutlined
                            sx={{ color: palette.primary.main }}
                          />
                        </IconButton>
                        <Typography>{wishlistCount}</Typography>
                        <IconButton aria-label="share">
                          <ShareOutlined />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default WishlistPage;
