import React, { useState, useEffect } from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { DRAWER_WIDTH, COLLAPSED_DRAWER_WIDTH } from "./layout.constants";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header open={open} isMobile={isMobile} onToggle={toggleDrawer} />
      <Sidebar open={open} isMobile={isMobile} onToggle={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: 8,
          minHeight: "100vh",
          bgcolor: "background.default",
          width: {
            xs: "100%",
            md: `calc(100% - ${open && !isMobile ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH}px)`,
          },
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
