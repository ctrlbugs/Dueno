import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  
  dataTheme: localStorage.getItem("dataTheme") || "light",
  dataLoader: localStorage.getItem("dataLoader") || "enable",
  isRtl: localStorage.getItem("rtl") || false,
};

const themeSettingSlice = createSlice({
  name: "themeSetting",
  initialState,
  reducers: {
   
    setDataTheme: (state, action) => {
      document.documentElement.setAttribute("data-theme", action.payload);
      state.dataTheme = action.payload;
      localStorage.setItem("dataTheme", action.payload);
    },
    
    setLoader: (state, action) => {
      state.dataLoader = action.payload;
      localStorage.setItem("dataLoader", action.payload);
      document.documentElement.setAttribute("data-loader", action.payload);
    },
    setRtl: (state, action) => {
      state.isRtl = action.payload;
      localStorage.setItem("rtl", action.payload);
      document.body.setAttribute("class", action.payload);
    },
    resetAllMode: (state: any) => {
      state.dataTheme = "light";
      state.dataLoader = "enable";
      state.isRtl = "";
      localStorage.setItem("dataTheme", "light");
      localStorage.setItem("dataLoader", "enable");
      localStorage.setItem("rtl", "");
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.setAttribute("data-loader", "enable");
      document.body.setAttribute("class", "");
    },
  },
});

export const {
  resetAllMode,
  setDataTheme,
  setLoader,
  setRtl,
} = themeSettingSlice.actions;

export default themeSettingSlice.reducer;
