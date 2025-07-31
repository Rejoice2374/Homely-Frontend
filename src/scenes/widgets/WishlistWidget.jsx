import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { FavoriteOutlined, FavoriteBorderOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setWishlist } from "../../state";

const WishlistWidget = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const wishlist = useSelector((state) => state.wishlist || []);
  const palette = useSelector((state) =>
    state.mode === "dark"
      ? {
          icon: "#fff",
          text: "#ccc",
        }
      : {
          icon: "#444",
          text: "#333",
        }
  );

  const wishlistIds = useMemo(
    () =>
      Array.isArray(wishlist)
        ? wishlist.map((item) => (typeof item === "string" ? item : item._id))
        : [],
    [wishlist]
  );

  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const getWishlist = async () => {
    try {
      const res = await fetch("https://homely-api.vercel.app/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      dispatch(setWishlist(data));
    } catch {
      setSnackbarMessage("Failed to fetch wishlist.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async (propertyId) => {
    const isWishlisted = wishlistIds.includes(propertyId);
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
        setSnackbarMessage(
          isWishlisted ? "Removed from wishlist!" : "Added to wishlist!"
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch {
      setSnackbarMessage("Action failed.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (token) getWishlist();
  }, [token]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box mt={2}>
      <Typography variant="h5" gutterBottom>
        Your Wishlist
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : wishlist.length === 0 ? (
        <Typography>No properties in your wishlist.</Typography>
      ) : (
        wishlist.map((prop) => (
          <Card key={prop._id} sx={{ mb: 2 }}>
            <CardMedia
              component="img"
              height="160"
              image={prop.propertyImages?.[0]}
              alt={prop.propertyName}
              onClick={() => navigate(`/property/${prop._id}`)}
              sx={{ cursor: "pointer" }}
            />
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6">{prop.propertyName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {prop.propertyType} · {prop.propertyLocation}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleWishlistToggle(prop._id)}>
                  {wishlistIds.includes(prop._id) ? (
                    <FavoriteOutlined sx={{ color: palette.icon }} />
                  ) : (
                    <FavoriteBorderOutlined sx={{ color: palette.icon }} />
                  )}
                </IconButton>
              </Box>
              <Typography fontWeight="bold" mt={1}>
                ${prop.propertyPrice?.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))
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
  );
};

export default WishlistWidget;
