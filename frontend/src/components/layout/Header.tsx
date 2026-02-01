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
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Logout as LogoutIcon,
  AccountCircleOutlined as ProfileIcon,
  LockOutlined as PasswordIcon,
} from "@mui/icons-material";
import { useThemeMode } from "../../contexts/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { type RootState } from "../../store";
import logo from "../../assets/ClassFlowHorizontal.png";
import { DRAWER_WIDTH } from "./layout.constants";
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
        {user && (
          <Typography
            variant="body1"
            sx={{
              ml: 1,
              mr: 2,
              fontWeight: 500,
              display: { xs: "none", sm: "block" },
            }}
          > 
            Welcome, {user.name}
          </Typography>
        )}
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
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
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
  );
};

export default Header;
