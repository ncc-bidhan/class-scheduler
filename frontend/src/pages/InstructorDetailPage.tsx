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
          mb: 4,
          color: "text.secondary",
          "&:hover": { background: "transparent", color: "primary.main" },
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        Back to Instructors
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
            {instructor.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Professional Instructor Profile
          </Typography>
        </Box>

        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              fontWeight="800"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              Contact Information
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
              {renderInfoItem(<EmailIcon />, "Email", instructor.email)}
              {renderInfoItem(<PhoneIcon />, "Phone", instructor.phone)}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              fontWeight="800"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              Assigned Branches
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
                minHeight: "100%",
              }}
            >
              {renderInfoItem(
                <BranchIcon />,
                "Active Locations",
                instructorBranches.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {instructorBranches.map((branch) => (
                      <Chip
                        key={branch._id}
                        label={branch.name}
                        size="medium"
                        onClick={() => navigate(`/branches/${branch._id}`)}
                        sx={{
                          cursor: "pointer",
                          borderRadius: 1,
                          fontWeight: "bold",
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "primary.dark"
                              : "primary.light",
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? "white"
                              : "primary.main",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                ) : (
                  "No branches assigned"
                ),
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              fontWeight="800"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              Professional Biography
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
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: "text.secondary",
                  whiteSpace: "pre-wrap",
                }}
              >
                {instructor.bio ||
                  "No professional biography provided for this instructor."}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default InstructorDetailPage;
