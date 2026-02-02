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
  Alert,
} from "@mui/material";
import {
  ArrowBackOutlined as ArrowBackIcon,
  ScheduleOutlined as ScheduleIcon,
  LocationOnOutlined as LocationIcon,
  PersonOutlined as PersonIcon,
  MeetingRoomOutlined as RoomIcon,
  GroupOutlined as CapacityIcon,
  TimerOutlined as DurationIcon,
  RepeatOutlined as RecurringIcon,
} from "@mui/icons-material";
import { DateTime } from "luxon";
import { useGetClassByIdQuery } from "../services/classesApi";
import type { Branch, Instructor, Room } from "../types";
import usePageTitle from "../hooks/usePageTitle";

const ClassDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetClassByIdQuery(id!);
  usePageTitle(response?.data?.name || "Class Details");

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (error || !response) {
    return (
      <Box>
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
    <Stack direction="row" spacing={2.5} sx={{ mb: 4 }}>
      <Box
        sx={{
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(144, 202, 249, 0.08)"
              : "rgba(148, 58, 208, 0.05)",
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon as React.ReactElement, {
          sx: { fontSize: "1.5rem" },
        })}
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="600" color="text.primary">
          {value}
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
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 700,
          color: "text.secondary",
          px: 2,
          "&:hover": {
            bgcolor: "action.hover",
            color: "primary.main",
            transform: "translateX(-4px)",
          },
          transition: "all 0.2s ease",
        }}
      >
        Back to Schedule
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(30, 30, 30, 0.6)"
              : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 32px rgba(148, 58, 208, 0.05)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            bgcolor: "primary.main",
          },
        }}
      >
        <Box sx={{ mb: 6 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "flex-start" }}
            spacing={3}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  letterSpacing: "-0.03em",
                  mb: 2,
                  fontSize: { xs: "2.25rem", md: "3.5rem" },
                  color: "text.primary",
                  lineHeight: 1.1,
                }}
              >
                {classDoc.name}
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                flexWrap="wrap"
                sx={{ gap: 1.5 }}
              >
                <Chip
                  label={
                    classDoc.type === "recurring"
                      ? "Recurring"
                      : "Single Session"
                  }
                  color={
                    classDoc.type === "recurring" ? "primary" : "secondary"
                  }
                  sx={{
                    borderRadius: 2,
                    fontWeight: 800,
                    px: 1,
                    height: 32,
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    letterSpacing: "0.05em",
                  }}
                  icon={
                    classDoc.type === "recurring" ? (
                      <RecurringIcon sx={{ fontSize: "1.1rem !important" }} />
                    ) : undefined
                  }
                />
                {classDoc.allowDropIn && (
                  <Chip
                    label="Drop-in Allowed"
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 800,
                      px: 1,
                      height: 32,
                      textTransform: "uppercase",
                      fontSize: "0.7rem",
                      letterSpacing: "0.05em",
                      borderColor: "divider",
                      color: "text.secondary",
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              mt: 4,
              fontSize: { xs: "1.05rem", md: "1.15rem" },
              lineHeight: 1.7,
              color: "text.secondary",
              maxWidth: "800px",
            }}
          >
            {classDoc.description || "No description provided for this class."}
          </Typography>
        </Box>

        <Divider sx={{ my: 6, opacity: 0.5 }} />

        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: "primary.main",
                fontSize: "0.85rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
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

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: "primary.main",
                fontSize: "0.85rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
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
