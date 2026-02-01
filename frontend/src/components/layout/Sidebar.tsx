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
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  MeetingRoom as MeetingRoomIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/ClassFlowHorizontal.png";

import { DRAWER_WIDTH } from "./layout.constants";

interface SidebarProps {
  open: boolean;
  isMobile: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, isMobile, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={isMobile ? onToggle : undefined}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          ...(!isMobile &&
            !open && {
              overflowX: "hidden",
              transition: (theme) =>
                theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              width: (theme) => theme.spacing(7),
            }),
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "flex-end",
          px: [1.5],
        }}
      >
        {open && (
          <Box
            component="img"
            src={logo}
            alt="ClassFlow"
            sx={{
              height: 80,
              ml: 1,
            }}
          />
        )}
        <IconButton onClick={onToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: open ? 1 : 0,
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "inherit",
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
