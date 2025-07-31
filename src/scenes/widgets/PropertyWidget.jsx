import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  CardActions,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Typography,
  Box,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setProperties } from "../../state";

const Property = () => {
  const { palette } = useTheme();
  const text = palette.neutral.text;
  const main = palette.neutral.main;
  const danger = palette.error.main;
  const blue = palette.primary.main;

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const properties = useSelector((state) => state.properties);

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // or "error"
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  // Modal open state
  const [openEdit, setOpenEdit] = useState(false);

  // Editable fields state
  const [editData, setEditData] = useState({
    Firstname: "",
    Lastname: "",
    occupation: "",
    location: "",
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://homely-api.vercel.app//api/property/myproperty",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch properties.");
      }

      const data = await res.json();
      dispatch(setProperties({ properties: data }));
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open modal
  const handleOpen = (property) => {
    setEditData({
      propertyName: property.propertyName || "",
      propertyLocation: property.propertyLocation || "",
      propertyType: property.propertyType || "",
      propertyPrice: property.propertyPrice || "",
      propertyDescription: property.propertyDescription || "",
    });
    setSelectedPropertyId(property._id);
    setOpenEdit(true);
  };

  // Close modal
  const handleClose = () => setOpenEdit(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Edit property by ID
  const handleSubmit = async () => {
    if (!selectedPropertyId) return;
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `https://homely-api.vercel.app//api/property/update/${selectedPropertyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      if (!res.ok) {
        const errRes = await res.json();
        throw new Error(errRes.message || "Update failed");
      }

      await fetchProperties(); // Refresh the list
      setSuccess("Property updated successfully!");
      setTimeout(() => {
        setOpenEdit(false);
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete property by ID
  const handleDelete = async (propertyId) => {
    try {
      const res = await fetch(
        `https://homely-api.vercel.app//api/property/${propertyId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete property.");
      }

      // Refresh properties after deletion
      fetchProperties();

      // Show success snackbar
      setSnackbarMessage("Property deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Delete error:", err.message);
      setSnackbarMessage("Failed to delete property.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (token) fetchProperties();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box p={2}>
        <Typography variant="h4" mb={2} color={text}>
          Your Listed Properties
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : Array.isArray(properties) && properties.length > 0 ? (
          <Grid container spacing={2} columns={{ xs: 2, sm: 8, md: 4, lg: 8 }}>
            {properties.map((prop) => (
              <Grid size={{ xs: 2, sm: 4, md: 4 }} key={prop._id}>
                <Box position="relative">
                  <Card>
                    <CardMedia
                      component="img"
                      height="180"
                      image={prop.propertyImages?.[0] || "/placeholder.jpg"}
                      alt={prop.propertyName}
                    />
                    {/* Availability Badge */}
                    <Box
                      position="absolute"
                      top={5}
                      right={5}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      width="80px"
                      height="30px"
                      p={2}
                      borderRadius="50%"
                      sx={{
                        backgroundColor:
                          prop.propertyStatus === "available" ? text : danger,
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {prop.propertyStatus === "available"
                          ? "Available"
                          : "N/A"}
                      </Typography>
                    </Box>
                    <CardContent>
                      <Typography variant="h6">{prop.propertyName}</Typography>
                      <Typography variant="body2" color={main}>
                        {prop.propertyType} · {prop.propertyLocation}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          mt={1}
                        >
                          ${Number(prop.propertyPrice).toLocaleString()}
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <IconButton onClick={() => handleOpen(prop)}>
                            <EditOutlined sx={{ color: blue }} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(prop._id)}>
                            <DeleteOutlineOutlined sx={{ color: danger }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No properties found.</Typography>
        )}
      </Box>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={handleClose}>
        <DialogTitle>Edit Property</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Property Name"
            name="propertyName"
            value={editData.propertyName}
            onChange={handleChange}
            fullWidth
            variant="standard"
            disabled={isSaving}
          />
          <TextField
            margin="dense"
            label="Location"
            name="propertyLocation"
            value={editData.propertyLocation}
            onChange={handleChange}
            fullWidth
            variant="standard"
            disabled={isSaving}
          />
          <TextField
            margin="dense"
            label="Type"
            name="propertyType"
            value={editData.propertyType}
            onChange={handleChange}
            fullWidth
            variant="standard"
            disabled={isSaving}
          />
          <TextField
            margin="dense"
            label="Price"
            name="propertyPrice"
            value={editData.propertyPrice}
            onChange={handleChange}
            fullWidth
            variant="standard"
            type="number"
            disabled={isSaving}
          />
          <TextField
            margin="dense"
            label="Description"
            name="propertyDescription"
            value={editData.propertyDescription}
            onChange={handleChange}
            fullWidth
            variant="standard"
            multiline
            rows={3}
            disabled={isSaving}
          />
          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" mt={2}>
              {success}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
    </>
  );
};

export default Property;
