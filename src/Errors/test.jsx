import { useEffect } from "react";
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
  Grid,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { FavoriteOutlined, ShareOutlined } from "@mui/icons-material";
import UserImage from "../../components/UserImage";
import defaultImage from "../../assets/default.jpg";
import { setProperties, setProperty } from "../../state";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  const { palette } = useTheme();
  // const text = palette.neutral.text;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token);
  const properties = useSelector((state) => state.properties);
  const loggedUserId = user._id;
  const isWishlisted = Boolean(wishlistedBy(loggedUserId));
  const wishlistCount = Object.keys(wishlistedBy).length;
  // const whitelists = useSelector((state) => state.user.whitelists);

  const patchWishlist = async () => {
    const response = await fetch(`https://homely-api.vercel.app//property/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const updatedProperty = await response.json();
    dispatch(setProperty((property: updatedProperty));)
  }

  const fetchProperties = async () => {
    try {
      const res = await fetch("https://homely-api.vercel.app//api/property", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Fetched data:", data);
      dispatch(setProperties({ properties: data }));
    } catch (err) {
      console.error("Failed to fetch properties", err.message);
    }
  };

  // const isWhitelisted = whitelists.find(
  //   (whitelist) => whitelist._id === property._id
  // );

  console.log("Properties in PropertyList after fetch:", properties);

  useEffect(() => {
    if (token) fetchProperties();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>
        All Properties
      </Typography>

      {!properties ? (
        <CircularProgress />
      ) : properties.length === 0 ? (
        <Typography>No properties found.</Typography>
      ) : Array.isArray(properties) && properties.length > 0 ? (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 8, lg: 12 }}
        >
          {properties.map((prop) => (
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
                  image={prop.propertyImages?.[0] || "/placeholder.jpg"}
                  alt={prop.propertyName}
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
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                        ${prop.propertyPrice?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteOutlined />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareOutlined />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No properties found.</Typography>
      )}
    </Box>
  );
};

export default PropertyList;
