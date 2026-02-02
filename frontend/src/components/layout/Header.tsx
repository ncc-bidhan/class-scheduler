import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Menu,
  MenuItem,
  Switch,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MenuOutlined as MenuIcon,
  Brightness4Outlined as DarkModeIcon,
  Brightness7Outlined as LightModeIcon,
  LogoutOutlined as LogoutIcon,
  AccountCircleOutlined as ProfileIcon,
  LockOutlined as PasswordIcon,
} from "@mui/icons-material";
import { useThemeMode } from "../../contexts/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { type RootState } from "../../store";
import { DRAWER_WIDTH, COLLAPSED_DRAWER_WIDTH } from "./layout.constants";
import ChangePasswordModal from "../auth/ChangePasswordModal";

interface HeaderProps {
  open: boolean;
  isMobile: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ open, isMobile, onToggle }) => {
  const { mode, toggleTheme } = useThemeMode();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const profileMenuOpen = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileClose();
    dispatch(logout());
  };

  const handleChangePassword = () => {
    handleProfileClose();
    setIsPasswordModalOpen(true);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer - 1,
          transition: (theme) =>
            theme.transitions.create(
              ["width", "margin", "height", "left", "right", "top"],
              {
                easing: theme.transitions.easing.sharp,
                duration: open
                  ? theme.transitions.duration.enteringScreen
                  : theme.transitions.duration.leavingScreen,
              },
            ),
          ...(!isMobile
            ? {
                top: "16px",
                left: `${(open ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH) + 24}px`,
                right: "24px",
                width: "auto",
                borderRadius: "16px",
                height: 64,
                justifyContent: "center",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
              }
            : {
                top: 0,
                left: 0,
                right: 0,
                width: "100%",
                height: 56,
              }),
        }}
      >
        <Toolbar sx={{ height: "100%", px: 2 }}>
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

          {user && (
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                display: { xs: "none", md: "block" },
              }}
            >
              Welcome, {user.name}
            </Typography>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                onClick={handleProfileClick}
                sx={{ p: 1 }}
              >
                <ProfileIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={profileMenuOpen}
                onClose={handleProfileClose}
                onClick={handleProfileClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem>
                  <ListItemIcon>
                    {mode === "dark" ? (
                      <LightModeIcon fontSize="small" />
                    ) : (
                      <DarkModeIcon fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Dark Mode" />
                  <Switch
                    edge="end"
                    checked={mode === "dark"}
                    onChange={toggleTheme}
                    onClick={(e) => e.stopPropagation()}
                  />
                </MenuItem>

                <MenuItem onClick={handleChangePassword}>
                  <ListItemIcon>
                    <PasswordIcon fontSize="small" />
                  </ListItemIcon>
                  Change Password
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>

        <ChangePasswordModal
          open={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </AppBar>
    </>
  );
};

export default Header;
