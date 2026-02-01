import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Stack,
  Skeleton,
  Alert,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  MeetingRoom as RoomIcon,
  Group as CapacityIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useGetRoomQuery } from "../services/roomApi";
import { useGetBranchQuery } from "../services/branchApi";

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetRoomQuery(id!);

  // Also fetch branch details to show branch name if we have the branchId
  const branchId = response?.data?.branchId;
  const { data: branchResponse } = useGetBranchQuery(branchId!, {
    skip: !branchId,
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (error || !response) {
    return (
      <Box sx={{ p: 3 }}>
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
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {room.name}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Room Details
            </Typography>

            {renderInfoItem(
              <CapacityIcon />,
              "Capacity",
              room.capacity ? `${room.capacity} Students` : "N/A",
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Location
            </Typography>

            {renderInfoItem(
              <LocationIcon />,
              "Branch",
              branchResponse?.data ? (
                <Chip
                  label={branchResponse.data.name}
                  size="small"
                  onClick={() =>
                    navigate(`/branches/${branchResponse.data._id}`)
                  }
                  sx={{ cursor: "pointer" }}
                />
              ) : (
                room.branchId
              ),
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default RoomDetailPage;
