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
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as BioIcon,
  LocationOn as BranchIcon,
} from "@mui/icons-material";
import { useGetInstructorQuery } from "../services/instructorApi";
import { useGetBranchesQuery } from "../services/branchApi";

const InstructorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetInstructorQuery(id!);
  const { data: branchesResponse } = useGetBranchesQuery();

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
  const instructorBranches =
    branchesResponse?.data.filter((b) =>
      instructor.branchIds.includes(b._id),
    ) || [];

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
            {instructor.name}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Contact Information
            </Typography>

            {renderInfoItem(<EmailIcon />, "Email", instructor.email)}
            {renderInfoItem(<PhoneIcon />, "Phone", instructor.phone)}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Assigned Branches
            </Typography>

            {renderInfoItem(
              <BranchIcon />,
              "Branches",
              instructorBranches.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {instructorBranches.map((branch) => (
                    <Chip
                      key={branch._id}
                      label={branch.name}
                      size="small"
                      onClick={() => navigate(`/branches/${branch._id}`)}
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Stack>
              ) : (
                "No branches assigned"
              ),
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Professional Details
            </Typography>

            {renderInfoItem(<BioIcon />, "Biography", instructor.bio)}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default InstructorDetailPage;
