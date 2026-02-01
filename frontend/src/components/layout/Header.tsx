import React from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { useThemeMode } from "../../contexts/ThemeContext";
import logo from "../../assets/ClassFlowHorizontal.png";
import { DRAWER_WIDTH } from "./layout.constants";

interface HeaderProps {
  open: boolean;
  isMobile: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ open, isMobile, onToggle }) => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: (theme) =>
          theme.transitions.create(["width", "margin", "height"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        ...(!isMobile &&
          open && {
            marginLeft: DRAWER_WIDTH,
            width: `calc(100% - ${DRAWER_WIDTH}px)`,
            height: 70,
            justifyContent: "center",
            transition: (theme) =>
              theme.transitions.create(["width", "margin", "height"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
      }}
    >
      <Toolbar sx={{ height: "100%" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onToggle}
          edge="start"
          sx={{
            marginRight: 2,
            ...(!isMobile && open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        {!open && (
          <Box
            component="img"
            src={logo}
            alt="ClassFlow"
            sx={{
              height: 80,
              display: "block",
            }}
          />
        )}
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
