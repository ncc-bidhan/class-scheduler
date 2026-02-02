import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  ArrowBackOutlined as ArrowBackIcon,
  GroupOutlined as CapacityIcon,
} from "@mui/icons-material";
import { useGetRoomQuery } from "../services/roomApi";
import usePageTitle from "../hooks/usePageTitle";

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetRoomQuery(id!);
  usePageTitle(response?.data?.name || "Room Details");

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (error || !response) {
    return (
      <Box>
        <Alert severity="error">
          Error loading room details. The room might not exist or there was a
          connection error.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/rooms")}
          sx={{ mt: 2 }}
        >
          Back to Rooms
        </Button>
      </Box>
    );
  }

  const room = response.data;

  const renderInfoItem = (
    icon: React.ReactNode,
    label: string,
    value: string | number | React.ReactNode,
  ) => (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <Box
        sx={{ color: "primary.main", display: "flex", alignItems: "center" }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {value || "N/A"}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 4,
          color: "text.secondary",
          "&:hover": { background: "transparent", color: "primary.main" },
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        Back to Rooms
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(145deg, #1e1e1e 0%, #121212 100%)"
              : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
        }}
      >
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            fontWeight="800"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              letterSpacing: "-0.02em",
              mb: 1,
            }}
          >
            {room.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Classroom Facilities & Capacity
          </Typography>
        </Box>

        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              fontWeight="800"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              Room Specifications
            </Typography>

            <Box
              sx={{
                p: 3,
                borderRadius: 1.5,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.01)",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {renderInfoItem(
                <CapacityIcon />,
                "Seating Capacity",
                room.capacity ? (
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <Typography variant="h4" fontWeight="800" color="primary">
                      {room.capacity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Students
                    </Typography>
                  </Box>
                ) : (
                  "Not specified"
                ),
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default RoomDetailPage;
