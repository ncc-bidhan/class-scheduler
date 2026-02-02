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
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          textTransform: "none",
          fontWeight: 800,
          color: "text.secondary",
          "&:hover": { bgcolor: "transparent", color: "primary.main" },
        }}
      >
        Back to Branches
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 20px 60px rgba(0,0,0,0.4)"
              : "0 20px 60px rgba(148, 58, 208, 0.05)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            bgcolor: "primary.main",
          },
        }}
      >
        <Box sx={{ mb: 6 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.25rem", md: "3rem" },
                  letterSpacing: "-0.04em",
                  color: "text.primary",
                  mb: 1,
                }}
              >
                {branch.name}
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                  }}
                >
                  <LocationIcon
                    fontSize="small"
                    sx={{ color: "primary.main" }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                  }}
                >
                  {branch.address || "No address provided"}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(144, 202, 249, 0.05)"
                    : "rgba(148, 58, 208, 0.02)",
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  textTransform: "uppercase",
                  fontSize: "0.9rem",
                  letterSpacing: "0.1em",
                }}
              >
                <EmailIcon color="primary" /> Contact Details
              </Typography>

              {renderInfoItem(<EmailIcon />, "Email Address", branch.email)}
              {renderInfoItem(<PhoneIcon />, "Phone Number", branch.phone)}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={5}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    textTransform: "uppercase",
                    fontSize: "0.9rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  <PersonIcon color="primary" /> Instructors
                </Typography>
                {instructors.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                    }}
                  >
                    {instructors.map((instructor) => (
                      <Chip
                        key={instructor._id}
                        label={instructor.name}
                        onClick={() =>
                          navigate(`/instructors/${instructor._id}`)
                        }
                        sx={{
                          borderRadius: 2,
                          px: 1,
                          height: 40,
                          fontWeight: 700,
                          cursor: "pointer",
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.03)",
                          border: "1px solid",
                          borderColor: "divider",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                            borderColor: "primary.main",
                            transform: "translateY(-2px)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, fontStyle: "italic" }}
                  >
                    No instructors assigned to this branch.
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    textTransform: "uppercase",
                    fontSize: "0.9rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  <RoomIcon color="primary" /> Rooms
                </Typography>
                {rooms.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                    }}
                  >
                    {rooms.map((room) => (
                      <Chip
                        key={room._id}
                        label={room.name}
                        variant="outlined"
                        onClick={() => navigate(`/rooms/${room._id}`)}
                        sx={{
                          borderRadius: 2,
                          px: 1,
                          height: 40,
                          fontWeight: 700,
                          cursor: "pointer",
                          borderColor: "primary.light",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "primary.light",
                            color: "white",
                            transform: "translateY(-2px)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, fontStyle: "italic" }}
                  >
                    No rooms available in this branch.
                  </Typography>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BranchDetailPage;
