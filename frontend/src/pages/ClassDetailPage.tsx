import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Chip,
  Stack,
  Skeleton,
  IconButton,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  MeetingRoom as RoomIcon,
  Group as CapacityIcon,
  Timer as DurationIcon,
  Repeat as RecurringIcon,
} from "@mui/icons-material";
import { DateTime } from "luxon";
import { useGetClassByIdQuery } from "../services/classesApi";
import type { Branch, Instructor, Room } from "../types";

const ClassDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetClassByIdQuery(id!);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (error || !response) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading class details. The class might not exist or there was a
          connection error.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to Schedule
        </Button>
      </Box>
    );
  }

  const classDoc = response.data;

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
      <Box>
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
          {value}
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
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {classDoc.name}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  label={
                    classDoc.type === "recurring"
                      ? "Recurring"
                      : "Single Session"
                  }
                  color={
                    classDoc.type === "recurring" ? "primary" : "secondary"
                  }
                  size="small"
                  icon={
                    classDoc.type === "recurring" ? (
                      <RecurringIcon />
                    ) : undefined
                  }
                />
                {classDoc.allowDropIn && (
                  <Chip
                    label="Drop-in Allowed"
                    variant="outlined"
                    size="small"
                  />
                )}
              </Stack>
            </Box>
          </Stack>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ whiteSpace: "pre-wrap" }}
          >
            {classDoc.description || "No description provided for this class."}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Schedule Details
            </Typography>

            {classDoc.type === "single" ? (
              renderInfoItem(
                <ScheduleIcon />,
                "Date & Time",
                classDoc.startAt
                  ? DateTime.fromISO(classDoc.startAt).toLocaleString(
                      DateTime.DATETIME_MED,
                    )
                  : "N/A",
              )
            ) : (
              <>
                {renderInfoItem(
                  <RecurringIcon />,
                  "Frequency",
                  `${classDoc.recurrence?.freq.toUpperCase()} ${classDoc.recurrence?.interval ? `(Every ${classDoc.recurrence.interval} ${classDoc.recurrence.freq === "daily" ? "days" : classDoc.recurrence.freq === "weekly" ? "weeks" : "months"})` : ""}`,
                )}
                {renderInfoItem(
                  <ScheduleIcon />,
                  "Start Date",
                  classDoc.dtstart
                    ? DateTime.fromISO(classDoc.dtstart).toLocaleString(
                        DateTime.DATE_MED,
                      )
                    : "N/A",
                )}
                {classDoc.until &&
                  renderInfoItem(
                    <ScheduleIcon />,
                    "Ends On",
                    DateTime.fromISO(classDoc.until).toLocaleString(
                      DateTime.DATE_MED,
                    ),
                  )}
              </>
            )}

            {renderInfoItem(
              <DurationIcon />,
              "Duration",
              `${classDoc.durationMinutes} minutes`,
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Location & Staff
            </Typography>

            {renderInfoItem(
              <PersonIcon />,
              "Instructor",
              typeof classDoc.instructorId === "object"
                ? (classDoc.instructorId as Instructor).name
                : "Unassigned",
            )}

            {renderInfoItem(
              <RoomIcon />,
              "Room",
              typeof classDoc.roomId === "object"
                ? (classDoc.roomId as Room).name
                : "Unassigned",
            )}

            {renderInfoItem(
              <LocationIcon />,
              "Branch",
              typeof classDoc.branchId === "object"
                ? (classDoc.branchId as Branch).name
                : "N/A",
            )}

            {renderInfoItem(
              <CapacityIcon />,
              "Capacity",
              `${classDoc.capacity} Students ${classDoc.waitlistCapacity ? `(+${classDoc.waitlistCapacity} Waitlist)` : ""}`,
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ClassDetailPage;
