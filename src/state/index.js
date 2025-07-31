import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  properties: [],
  wishlist: [], // Initialize wishlist state
  whitelists: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.wishlist = [];
      state.properties = [];
    },
    setWhitelists: (state, action) => {
      if (state.user) {
        state.user.whitelists = action.payload.whitelists;
      } else {
        console.error("User whitelists non-existent :(");
      }
    },
    setProperties: (state, action) => {
      state.properties = action.payload.properties;
    },
    setProperty: (state, action) => {
      const updated = action.payload;
      const index = state.properties.findIndex((p) => p._id === updated._id);
      state.properties[index] = updated;
    },
    setWishlist: (state, action) => {
      state.wishlist = Array.isArray(action.payload) ? action.payload : [];
    },
    toggleWishlist: (state, action) => {
      const propertyId = action.payload;
      const index = state.wishlist.findIndex((item) => item._id === propertyId);
      if (index !== -1) {
        // If already wishlisted, remove it
        state.wishlist.splice(index, 1);
      } else {
        // Otherwise, add it (you should already have the property object in your properties list)
        const property = state.properties.find((p) => p._id === propertyId);
        if (property) {
          state.wishlist.push(property);
        }
      }
    },

    addProperty: (state, action) => {
      state.properties.unshift(action.payload.property); // Add to top of list
    },
    removeProperty: (state, action) => {
      state.properties = state.properties.filter(
        (property) => property._id !== action.payload.id
      );
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setWhitelists,
  setProperties,
  setProperty,
  setWishlist,
  toggleWishlist,
  addProperty,
  removeProperty,
} = authSlice.actions;

export default authSlice.reducer;
