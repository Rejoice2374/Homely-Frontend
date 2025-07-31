import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProperties } from "../../state";
import Property from "./PropertyWidget";

const UploadProperty = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token);

  const inputStyle = {
    width: "100%",
    backgroundColor: palette.neutral.text,
    borderRadius: "0.25rem",
    marginBottom: "1rem",
  };

  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [leaseType, setLeaseType] = useState("");
  const [leaseDuration, setLeaseDuration] = useState("");
  const [propertyPrice, setPropertyPrice] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [images, setImages] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // or "error"

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("propertyName", propertyName);
      formData.append("propertyType", propertyType);
      formData.append("propertyDescription", propertyDescription);
      formData.append("leaseType", leaseType);
      formData.append("leaseDuration", leaseDuration);
      formData.append("propertyPrice", Number(propertyPrice));
      formData.append("propertyLocation", propertyLocation);

      images.forEach((img) => formData.append("pictures", img));

      const response = await fetch(
        "http://localhost:3001/api/property/upload",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const properties = await response.json();
      dispatch(setProperties({ properties }));

      // Clear form
      setPropertyName("");
      setPropertyType("");
      setPropertyDescription("");
      setLeaseType("");
      setLeaseDuration("");
      setPropertyPrice("");
      setPropertyLocation("");
      setImages([]);

      // Show success snackbar
      setSnackbarMessage("Property uploaded successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Upload failed:", err.message);
      setSnackbarMessage("Failed to upload property.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const isFormValid =
    propertyName &&
    propertyType &&
    propertyDescription &&
    leaseType &&
    leaseDuration &&
    propertyPrice &&
    propertyLocation &&
    images.length > 0;

  return (
    <div>
      {/* form UI here */}
      <Box
        width="100%"
        p="1rem"
        bgcolor={palette.background.alt}
        borderRadius="0.75rem"
      >
        <Typography variant="h5" fontWeight="500" sx={{ mb: "1rem" }}>
          Post a New Property
        </Typography>
        <InputBase
          placeholder="Property Name"
          value={propertyName}
          onChange={(e) => setPropertyName(e.target.value)}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.text,
            borderRadius: "0.25rem",
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
          }}
        />
        <Select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          fullWidth
          displayEmpty
          sx={inputStyle}
        >
          <MenuItem disabled value="">
            Select Property Type
          </MenuItem>
          {["Duplex", "Studio", "Condo", "Office", "Shortlet", "Land"].map(
            (type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            )
          )}
        </Select>
        <InputBase
          placeholder="Description"
          value={propertyDescription}
          onChange={(e) => setPropertyDescription(e.target.value)}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.text,
            borderRadius: "0.25rem",
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
          }}
        />
        <Select
          value={leaseType}
          onChange={(e) => setLeaseType(e.target.value)}
          fullWidth
          displayEmpty
          sx={inputStyle}
        >
          <MenuItem disabled value="">
            Select Lease Type
          </MenuItem>
          {["short-term rental", "long-term rental", "lease", "sale"].map(
            (type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            )
          )}
        </Select>
        <Select
          value={leaseDuration}
          onChange={(e) => setLeaseDuration(e.target.value)}
          fullWidth
          displayEmpty
          sx={inputStyle}
        >
          <MenuItem disabled value="">
            Select Lease Duration
          </MenuItem>
          {["daily", "weekly", "monthly", "yearly", "permanent"].map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <InputBase
          placeholder="Price"
          value={propertyPrice}
          onChange={(e) => setPropertyPrice(e.target.value)}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.text,
            borderRadius: "0.25rem",
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
          }}
        />
        <InputBase
          placeholder="Location"
          value={propertyLocation}
          onChange={(e) => setPropertyLocation(e.target.value)}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.text,
            borderRadius: "0.25rem",
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
          }}
        />
        <Box display="flex" alignItems="center" gap="1rem" mb="1rem">
          <Button variant="contained" component="label">
            <AttachFileOutlined />
            Upload Images
            <input
              type="file"
              multiple
              hidden
              onChange={(e) => setImages([...e.target.files])}
            />
          </Button>
          <Tooltip title={!isFormValid ? "Fill all required fields" : ""}>
            <span>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePost}
                disabled={!isFormValid}
              >
                Post Property
              </Button>
            </span>
          </Tooltip>
        </Box>
        <Divider sx={{ margin: "1rem 0" }} />
        <Box display="flex" flexDirection="column" gap="0.5rem">
          {images.map((img, index) => (
            <Box key={index} display="flex" alignItems="center" gap="0.5rem">
              <img
                src={
                  img.type?.startsWith("image") ? URL.createObjectURL(img) : ""
                }
                alt={`property-${index}`}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "0.25rem",
                }}
              />
              <Typography variant="body2">{img.name}</Typography>
            </Box>
          ))}
        </Box>
        <Box display="flex" justifyContent="space-between" mt="1rem">
          <Box display="flex" alignItems="center" gap="0.5rem">
            <IconButton>
              <EditOutlined />
            </IconButton>
            <IconButton>
              <DeleteOutlined />
            </IconButton>
            <IconButton>
              <MoreHorizOutlined />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center" gap="0.5rem">
            <IconButton>
              <ImageOutlined />
            </IconButton>
            <IconButton>
              <GifBoxOutlined />
            </IconButton>
            <IconButton>
              <MicOutlined />
            </IconButton>
          </Box>
        </Box>
      </Box>
      {/* Created properties */}
      <Box mt="2rem">
        <Typography variant="h5" fontWeight="500" sx={{ mb: "1rem" }}>
          Your Properties
        </Typography>
        <Property />
      </Box>
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
    </div>
  );
};

export default UploadProperty;
