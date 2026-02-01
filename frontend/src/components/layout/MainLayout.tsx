import React, { useState, useEffect } from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { DRAWER_WIDTH, COLLAPSED_DRAWER_WIDTH } from "./layout.constants";

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);

  // Update open state when screen size changes
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

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
          p: { xs: 2, md: 3 },
          mt: { xs: 8, md: 12 }, // 96px (16px top + 64px height + 16px gap)
          height: {
            xs: "calc(100vh - 64px)", // 100vh - (0px top + 56px height + 8px gap)
            md: "calc(100vh - 96px)", // 100vh - (16px top + 64px height + 16px gap)
          },
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
