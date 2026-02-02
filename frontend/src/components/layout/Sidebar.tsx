import React from "react";
import {
  Drawer,
  Toolbar,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
} from "@mui/material";
import {
  CalendarMonthOutlined as CalendarIcon,
  BusinessOutlined as BusinessIcon,
  PeopleOutlined as PeopleIcon,
  MeetingRoomOutlined as MeetingRoomIcon,
  ChevronLeftOutlined as ChevronLeftIcon,
  ChevronRightOutlined as ChevronRightIcon,
  MenuOutlined as MenuIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/ClassFlowHorizontal.png";

import {
  DRAWER_WIDTH,
  COLLAPSED_DRAWER_WIDTH,
  SIDEBAR_ITEM_HEIGHT,
} from "./layout.constants";

interface SidebarProps {
  open: boolean;
  isMobile: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, isMobile, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === "dark";
  const unselectedColor = isDarkMode ? "text.primary" : "text.secondary";

  const menuItems = [
    { text: "Calendar", icon: <CalendarIcon />, path: "/" },
    { text: "Branches", icon: <BusinessIcon />, path: "/branches" },
    { text: "Instructors", icon: <PeopleIcon />, path: "/instructors" },
    { text: "Rooms", icon: <MeetingRoomIcon />, path: "/rooms" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onToggle();
    }
  };

  const activeIndex = menuItems.findIndex((item) => {
    if (item.path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(item.path);
  });

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={isMobile ? onToggle : undefined}
      sx={{
        width: isMobile
          ? DRAWER_WIDTH
          : open
            ? DRAWER_WIDTH
            : COLLAPSED_DRAWER_WIDTH,
        flexShrink: 0,
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: open
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        [`& .MuiDrawer-paper`]: {
          width: isMobile
            ? DRAWER_WIDTH
            : open
              ? DRAWER_WIDTH
              : COLLAPSED_DRAWER_WIDTH,
          boxSizing: "border-box",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          ...(!isMobile &&
            !open && {
              overflowX: "hidden",
            }),
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: open ? [1.5] : 0,
          minHeight: "80px !important",
        }}
      >
        {open ? (
          <>
            <Box
              component="img"
              src={logo}
              alt="ClassFlow"
              sx={{
                height: 60,
                ml: 1,
              }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={onToggle} sx={{ color: unselectedColor }}>
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <Box
            component="img"
            src="/favicon.png"
            alt="ClassFlow Favicon"
            sx={{
              height: 40,
              width: 40,
            }}
          />
        )}
      </Toolbar>
      <Divider />
      <List sx={{ position: "relative", p: 0 }}>
        {activeIndex !== -1 && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: SIDEBAR_ITEM_HEIGHT,
              bgcolor: isDarkMode
                ? "rgba(144, 202, 249, 0.12)"
                : "rgba(148, 58, 208, 0.08)",
              borderLeft: `4px solid ${isDarkMode ? "#90caf9" : "#943ad0"}`,
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: `translateY(${activeIndex * SIDEBAR_ITEM_HEIGHT}px)`,
              zIndex: 0,
              pointerEvents: "none",
              willChange: "transform",
            }}
          />
        )}
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                height: SIDEBAR_ITEM_HEIGHT,
                justifyContent: open ? "initial" : "center",
                px: open ? 2.5 : 1.5,
                py: 2,
                bgcolor: "transparent !important",
                "&:hover": {
                  bgcolor: isDarkMode
                    ? "rgba(255, 255, 255, 0.05) !important"
                    : "rgba(0, 0, 0, 0.04) !important",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 0,
                  justifyContent: "center",
                  zIndex: 1,
                  color:
                    location.pathname === item.path
                      ? isDarkMode
                        ? "common.white"
                        : "primary.main"
                      : unselectedColor,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  display: open ? "block" : "none",
                  opacity: open ? 1 : 0,
                  zIndex: 1,
                  color:
                    location.pathname === item.path
                      ? isDarkMode
                        ? "common.white"
                        : "primary.main"
                      : unselectedColor,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
