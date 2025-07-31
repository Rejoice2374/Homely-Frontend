import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import HouseIcon from "@mui/icons-material/House";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import XIcon from "../../assets/X.png";
import FacebookIcon from "../../assets/Facebook.png";

const UserWidget = ({ picture }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const text = palette.neutral.text;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const loggedInUserId = useSelector((state) => state.user.user._id);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal open state
  const [openEdit, setOpenEdit] = useState(false);

  // Editable fields state
  const [editData, setEditData] = useState({
    Firstname: "",
    Lastname: "",
    occupation: "",
    location: "",
  });

  const getUser = async () => {
    try {
      const response = await fetch(
        `https://homely-api.vercel.app//api/user/me`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUser(data);
      // Initialize edit form with fetched data
      setEditData({
        Firstname: data.Firstname || "",
        Lastname: data.Lastname || "",
        occupation: data.occupation || "",
        location: data.location || "",
      });
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    _id,
    Firstname,
    Lastname,
    occupation,
    properties,
    tenants,
    location,
  } = user;

  const isCurrentUser = _id === loggedInUserId;

  // Open modal
  const handleOpen = () => setOpenEdit(true);
  // Close modal
  const handleClose = () => setOpenEdit(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated data
  const handleSubmit = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`https://homely-api.vercel.app//api/user/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        const errRes = await res.json();
        throw new Error(errRes.message || "Update failed");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setOpenEdit(false);
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <WidgetWrapper>
        {/* First Row */}
        <FlexBetween
          gap="0.5rem"
          pb="1.1rem"
          onClick={() => navigate(`/profile/${_id}`)}
          sx={{ cursor: "pointer" }}
        >
          {/* User Image and Name */}
          <FlexBetween gap="1rem">
            <UserImage image={user.picture || picture} size="55px" />
            <Box>
              <Typography
                variant="h4"
                color={medium}
                fontWeight="500"
                sx={{
                  "&:hover": {
                    color: palette.secondary.text,
                    cursor: "pointer",
                  },
                }}
              >
                {Firstname} {Lastname}
              </Typography>
            </Box>
          </FlexBetween>
          {isCurrentUser && (
            <IconButton onClick={handleOpen} aria-label="Edit Profile">
              <ManageAccountsOutlined sx={{ color: main }} />
            </IconButton>
          )}
        </FlexBetween>

        <Divider />
        {/* Occupation & Location */}
        <Box p="1rem 0">
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <LocationOnOutlined
              fontSize="large"
              sx={{ color: palette.neutral.main }}
            />
            <Typography color={palette.neutral.main}>
              {location || "Unknown"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="1rem">
            <WorkOutlineOutlined
              fontSize="large"
              sx={{ color: palette.neutral.main }}
            />
            <Typography color={palette.neutral.main}>
              {occupation || "Not specified"}
            </Typography>
          </Box>
        </Box>

        {/* Edit Profile */}
        {isCurrentUser && (
          <>
            <Divider />
            <Box p="1rem 0">
              <FlexBetween mb="0.5rem">
                <Typography
                  color={medium}
                  gap="0.5rem"
                  display="flex"
                  alignItems="center"
                >
                  <PeopleOutlinedIcon sx={{ color: main }} />
                  {tenants?.length === 1 ? "Tenant" : "Tenants"}{" "}
                </Typography>
                <Typography color={text}>{tenants?.length || 0} </Typography>
              </FlexBetween>
              <FlexBetween mb="0.5rem">
                <Typography
                  color={medium}
                  gap="0.5rem"
                  display="flex"
                  alignItems="center"
                >
                  <HouseIcon sx={{ color: main }} />
                  {properties?.length === 1 ? "Property" : "Properties"}
                </Typography>
                <Typography color={text}>{properties?.length || 0} </Typography>
              </FlexBetween>
            </Box>
          </>
        )}

        <Divider />
        {/* Fourth Row */}
        <Box p="1rem 0">
          <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
            Social Profiles
          </Typography>

          {/* X */}
          <FlexBetween gap="1rem" mb="0.5rem">
            <FlexBetween gap="1rem">
              <a
                href={`https://x.com/${Firstname.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={XIcon}
                  alt="X"
                  style={{ width: "24px", height: "24px" }}
                />
              </a>
              <Box>
                <Typography color={medium}>X Profile</Typography>
                <Typography color={main}>@{Firstname.toLowerCase()}</Typography>
              </Box>
            </FlexBetween>
            <EditOutlined sx={{ color: main, cursor: "pointer" }} />
          </FlexBetween>

          {/* Facebook */}
          <FlexBetween gap="1rem">
            <FlexBetween gap="1rem">
              <a
                href={`https://facebook.com/${Firstname.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={FacebookIcon}
                  alt="Facebook"
                  style={{ width: "24px", height: "24px" }}
                />
              </a>
              <Box>
                <Typography color={medium}>Facebook Profile</Typography>
                <Typography color={main}>@{Firstname.toLowerCase()}</Typography>
              </Box>
            </FlexBetween>
            <EditOutlined sx={{ color: main, cursor: "pointer" }} />
          </FlexBetween>
        </Box>
      </WidgetWrapper>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Firstname"
            name="Firstname"
            value={editData.Firstname}
            onChange={handleChange}
            fullWidth
            variant="standard"
            disabled={isSaving}
          />
          <TextField
            margin="dense"
            label="Lastname"
            name="Lastname"
            value={editData.Lastname}
            onChange={handleChange}
            fullWidth
            variant="standard"
            disabled={isSaving}
          />
          <TextField
            margin="dense"
            label="Occupation"
            name="occupation"
            value={editData.occupation}
            onChange={handleChange}
            fullWidth
            variant="standard"
            disabled={isSaving}
          />
          <TextField
            margin="dense"
            label="Location"
            name="location"
            value={editData.location}
            onChange={handleChange}
            fullWidth
            variant="standard"
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
    </>
  );
};

export default UserWidget;
