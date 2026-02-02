import React from "react";
import {
  Drawer,
  Toolbar,
  List,
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
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "10px 0 30px rgba(0,0,0,0.3)"
              : "10px 0 30px rgba(0,0,0,0.02)",
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
          px: open ? 2 : 0,
          minHeight: "80px !important",
          borderBottom: "1px solid",
          borderColor: "divider",
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
                transition: "all 0.3s ease",
                filter: (theme) =>
                  theme.palette.mode === "dark" ? "brightness(1.2)" : "none",
              }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              onClick={onToggle}
              sx={{
                color: unselectedColor,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.06)",
                },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <Box
            component="img"
            src="/favicon.png"
            alt="ClassFlow Favicon"
            sx={{
              height: 32,
              width: 32,
              transition: "all 0.3s ease",
            }}
          />
        )}
      </Toolbar>
      <List sx={{ position: "relative", p: 0, mt: 2 }}>
        {activeIndex !== -1 && (
          <Box
            sx={{
              position: "absolute",
              left: 8,
              right: 8,
              top: 0,
              height: SIDEBAR_ITEM_HEIGHT,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(25, 118, 210, 0.12)"
                  : "rgba(148, 58, 208, 0.08)",
              borderRadius: 2,
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: `translateY(${activeIndex * SIDEBAR_ITEM_HEIGHT}px)`,
              zIndex: 0,
              pointerEvents: "none",
              willChange: "transform",
              "&::before": {
                content: '""',
                position: "absolute",
                left: -8,
                top: "20%",
                bottom: "20%",
                width: 4,
                bgcolor: "primary.main",
                borderRadius: "0 4px 4px 0",
              },
            }}
          />
        )}
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: "block", px: 1 }}
            >
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  height: SIDEBAR_ITEM_HEIGHT,
                  justifyContent: open ? "initial" : "center",
                  px: open ? 2 : 1.5,
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: "transparent !important",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.04) !important"
                        : "rgba(0, 0, 0, 0.02) !important",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 0,
                    justifyContent: "center",
                    zIndex: 1,
                    transition: "all 0.2s ease",
                    color: isActive ? "primary.main" : unselectedColor,
                    transform: isActive ? "scale(1.1)" : "none",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 800 : 500,
                    fontSize: "0.9rem",
                    letterSpacing: isActive ? "0.01em" : "0",
                  }}
                  sx={{
                    display: open ? "block" : "none",
                    opacity: open ? 1 : 0,
                    zIndex: 1,
                    color: isActive ? "text.primary" : unselectedColor,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
