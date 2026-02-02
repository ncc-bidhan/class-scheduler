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
  Avatar,
} from "@mui/material";
import {
  ArrowBackOutlined as ArrowBackIcon,
  EmailOutlined as EmailIcon,
  PhoneOutlined as PhoneIcon,
  DescriptionOutlined as BioIcon,
  LocationOnOutlined as BranchIcon,
} from "@mui/icons-material";
import { useGetInstructorQuery } from "../services/instructorApi";
import usePageTitle from "../hooks/usePageTitle";

const InstructorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetInstructorQuery(id!);
  usePageTitle(response?.data?.name || "Instructor Details");

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
          Error loading instructor details. The instructor might not exist or
          there was a connection error.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/instructors")}
          sx={{ mt: 2 }}
        >
          Back to Instructors
        </Button>
      </Box>
    );
  }

  const instructor = response.data;
  const instructorBranches = instructor.branchIds.filter(
    (b): b is { _id: string; name: string } =>
      typeof b === "object" && b !== null,
  );

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
        Back to Instructors
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
            spacing={3}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "primary.main",
                fontSize: "2.5rem",
                fontWeight: "bold",
                boxShadow: "0 8px 24px rgba(148, 58, 208, 0.2)",
              }}
            >
              {instructor.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.25rem", md: "3rem" },
                  letterSpacing: "-0.04em",
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                {instructor.name}
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "0.15em",
                }}
              >
                Professional Instructor
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Grid container spacing={6}>
          {/* Main Content - Biography */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 4 }}>
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
                <BioIcon color="primary" /> Professional Biography
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.01)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: "text.secondary",
                    whiteSpace: "pre-wrap",
                    fontSize: "1.05rem",
                  }}
                >
                  {instructor.bio ||
                    "No professional biography provided for this instructor."}
                </Typography>
              </Paper>
            </Box>
          </Grid>

          {/* Sidebar - Contact & Branches */}
          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              {/* Contact Info */}
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
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  <EmailIcon color="primary" /> Contact Details
                </Typography>

                {renderInfoItem(
                  <EmailIcon />,
                  "Email Address",
                  instructor.email,
                )}
                {renderInfoItem(
                  <PhoneIcon />,
                  "Phone Number",
                  instructor.phone,
                )}
              </Box>

              {/* Active Branches */}
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
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  <BranchIcon color="primary" /> Active Branches
                </Typography>

                {instructorBranches.length > 0 ? (
                  <Stack spacing={1.5}>
                    {instructorBranches.map((branch) => (
                      <Button
                        key={branch._id}
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate(`/branches/${branch._id}`)}
                        startIcon={<BranchIcon fontSize="small" />}
                        sx={{
                          justifyContent: "flex-start",
                          textTransform: "none",
                          fontWeight: 700,
                          borderRadius: 2,
                          py: 1.5,
                          px: 2,
                          borderWidth: "1.5px",
                          "&:hover": {
                            borderWidth: "1.5px",
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}
                      >
                        {branch.name}
                      </Button>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    No branches assigned
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

export default InstructorDetailPage;
