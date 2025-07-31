import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  Snackbar,
  Alert,
  Button,
  Grid,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  FavoriteOutlined,
  FavoriteBorderOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import UserImage from "../../components/UserImage";
import defaultImage from "../../assets/default.jpg";
import { setProperties, setWishlist } from "../../state";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  const { palette } = useTheme();
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const text = palette.neutral.text;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token);
  const properties = useSelector((state) => state.properties);
  const wishlist = useSelector((state) => state.wishlist || []);

  const wishlistIds = useMemo(
    () =>
      Array.isArray(wishlist)
        ? wishlist.map((item) => (typeof item === "string" ? item : item._id))
        : [],
    [wishlist]
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const fetchProperties = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/property", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      dispatch(setProperties({ properties: data }));
    } catch (err) {
      console.error("Failed to fetch properties", err.message);
    }
  };

  const getWishlist = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      dispatch(setWishlist(data));
    } catch (err) {
      console.error("Failed to fetch wishlist", err.message);
      setSnackbarMessage("Failed to fetch wishlist.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleWishlistToggle = async (propertyId) => {
    const isWishlisted = wishlistIds.includes(propertyId);
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

        // Update properties list locally
        dispatch(
          setProperties({
            properties: properties.map((prop) =>
              prop._id === propertyId
                ? {
                    ...prop,
                    wishlistedBy: isWishlisted
                      ? { ...prop.wishlistedBy, [user._id]: undefined } // remove
                      : { ...prop.wishlistedBy, [user._id]: true }, // add
                  }
                : prop
            ),
          })
        );

        setSnackbarMessage(
          isWishlisted
            ? "Property removed from wishlist!"
            : "Property added to wishlist!"
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Wishlist toggle failed", err.message);
      setSnackbarMessage("Failed to toggle wishlist.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProperties();
      getWishlist();
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box p={2}>
      <Typography variant="h2" mb={2} textAlign="center">
        All Properties
      </Typography>

      {!properties ? (
        <CircularProgress />
      ) : properties.length === 0 ? (
        <Typography>No properties found.</Typography>
      ) : (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 8, lg: 12 }}
        >
          {properties.map((prop) => {
            const isWishlisted = wishlistIds.includes(prop._id);
            {
              /* const wishlistCount = (prop.wishlistedBy || []).length; */
            }
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
                        color={main}
                        fontWeight="500"
                        sx={{ "&:hover": { color: medium, cursor: "pointer" } }}
                        onClick={() =>
                          navigate(`/profile/${prop.userId || user._id}`)
                        }
                      >
                        {prop.agentName}
                      </Typography>
                    }
                    subheader={new Date(
                      prop.createdAt || Date.now()
                    ).toLocaleDateString()}
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
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-end"
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ cursor: "pointer" }}
                          onClick={() => navigate(`/property/${prop._id}`)}
                        >
                          {prop.propertyName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {prop.propertyType} · {prop.propertyLocation}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          mt={1}
                        >
                          ${prop.propertyPrice?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      ml={1}
                      width="100%"
                    >
                      <Button variant="contained">
                        {prop.leaseType === "sale" ? "Buy" : "Rent"}
                      </Button>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          aria-label="toggle wishlist"
                          onClick={() => handleWishlistToggle(prop._id)}
                        >
                          {isWishlisted ? (
                            <FavoriteOutlined sx={{ color: text }} />
                          ) : (
                            <FavoriteBorderOutlined sx={{ color: text }} />
                          )}
                        </IconButton>
                        <Typography>{wishlistCount}</Typography>
                        <IconButton aria-label="share">
                          <ShareOutlined />
                        </IconButton>
                      </Box>
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
  );
};

export default PropertyList;
