import React, { useState, useEffect } from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [open, setOpen] = useState(isLargeScreen && !isMobile);

  useEffect(() => {
    setOpen(isLargeScreen && !isMobile);
  }, [isLargeScreen, isMobile]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />
      <Header open={open} isMobile={isMobile} onToggle={toggleDrawer} />
      <Sidebar open={open} isMobile={isMobile} onToggle={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: { xs: 8, md: 12 },
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          height: {
            xs: "calc(100vh - 64px)",
            md: "calc(100vh - 96px)",
          },
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "background.default" : "#f4f7fe",
          transition: (theme) =>
            theme.transitions.create(["width", "margin", "padding"], {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          position: "relative",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
