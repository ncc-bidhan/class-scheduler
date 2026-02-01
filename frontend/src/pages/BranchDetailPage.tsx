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
} from "@mui/material";
import {
  ArrowBackOutlined as ArrowBackIcon,
  LocationOnOutlined as LocationIcon,
  PhoneOutlined as PhoneIcon,
  EmailOutlined as EmailIcon,
  AccessTimeOutlined as TimezoneIcon,
  MeetingRoomOutlined as RoomIcon,
  PersonOutlined as PersonIcon,
} from "@mui/icons-material";
import { useGetBranchQuery } from "../services/branchApi";
import { useGetRoomsQuery } from "../services/roomApi";
import { useGetInstructorsQuery } from "../services/instructorApi";
import { Chip } from "@mui/material";
import usePageTitle from "../hooks/usePageTitle";

const BranchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetBranchQuery(id!);
  usePageTitle(response?.data?.name || "Branch Details");
  const { data: roomsResponse } = useGetRoomsQuery({ branchId: id });
  const { data: instructorsResponse } = useGetInstructorsQuery({
    branchId: id,
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
          Error loading branch details. The branch might not exist or there was
          a connection error.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/branches")}
          sx={{ mt: 2 }}
        >
          Back to Branches
        </Button>
      </Box>
    );
  }

  const branch = response.data;
  const rooms = roomsResponse?.data || [];
  const instructors = instructorsResponse?.data || [];

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
    <Box sx={{ maxWidth: 1000, mx: "auto", p: { xs: 2, md: 3 } }}>
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
            {branch.name}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Contact Information
            </Typography>

            {renderInfoItem(<EmailIcon />, "Email", branch.email)}
            {renderInfoItem(<PhoneIcon />, "Phone", branch.phone)}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Location Details
            </Typography>

            {renderInfoItem(<LocationIcon />, "Address", branch.address)}
            {renderInfoItem(<TimezoneIcon />, "Timezone", branch.timezone)}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Staff & Rooms
            </Typography>

            {renderInfoItem(
              <PersonIcon />,
              "Instructors",
              instructors.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {instructors.map((instructor) => (
                    <Chip
                      key={instructor._id}
                      label={instructor.name}
                      size="small"
                      onClick={() => navigate(`/instructors/${instructor._id}`)}
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Stack>
              ) : (
                "No instructors assigned"
              ),
            )}

            {renderInfoItem(
              <RoomIcon />,
              "Rooms",
              rooms.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {rooms.map((room) => (
                    <Chip
                      key={room._id}
                      label={room.name}
                      size="small"
                      onClick={() => navigate(`/rooms/${room._id}`)}
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Stack>
              ) : (
                "No rooms available"
              ),
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BranchDetailPage;
