import React, { useState, useMemo } from "react";
import { DateTime } from "luxon";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Paper,
  Stack,
  Skeleton,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import CalendarGrid from "../components/CalendarGrid";
import CreateClassModal from "../components/CreateClassModal";

import { useGetOccurrencesQuery } from "../services/classesApi";

const CalendarPage: React.FC = () => {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [search, setSearch] = useState("");
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate date range for RTK Query based on current view and date
  const dateRange = useMemo(() => {
    let from: DateTime;
    let to: DateTime;

    switch (view) {
      case "day":
        from = currentDate.startOf("day");
        to = currentDate.endOf("day");
        break;
      case "week":
        from = currentDate.startOf("week");
        to = currentDate.endOf("week");
        break;
      case "month":
        // For month view, we fetch from start of first week of month to end of last week of month
        from = currentDate.startOf("month").startOf("week");
        to = currentDate.endOf("month").endOf("week");
        break;
      default:
        from = currentDate.startOf("week");
        to = currentDate.endOf("week");
    }

    return {
      from: from.toUTC().toISO() || "",
      to: to.toUTC().toISO() || "",
    };
  }, [currentDate, view]);

  const {
    data: response,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetOccurrencesQuery(dateRange);

  const occurrences = response?.data || [];

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextView: "day" | "week" | "month",
  ) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const handleNavigate = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setCurrentDate(DateTime.now());
      return;
    }

    const amount = direction === "next" ? 1 : -1;
    switch (view) {
      case "day":
        setCurrentDate(currentDate.plus({ days: amount }));
        break;
      case "week":
        setCurrentDate(currentDate.plus({ weeks: amount }));
        break;
      case "month":
        setCurrentDate(currentDate.plus({ months: amount }));
        break;
    }
  };

  const getHeaderTitle = () => {
    switch (view) {
      case "day":
        return currentDate.toLocaleString(DateTime.DATE_HUGE);
      case "week":
        const start = currentDate.startOf("week");
        const end = currentDate.endOf("week");
        if (start.month === end.month) {
          return `${start.monthLong} ${start.year}`;
        }
        return `${start.monthShort} - ${end.monthShort} ${end.year}`;
      case "month":
        return currentDate.toLocaleString({ month: "long", year: "numeric" });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Class Schedule
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and view all upcoming class occurrences.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: { xs: "100%", md: 250 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disableElevation
            onClick={() => setIsModalOpen(true)}
            sx={{ textTransform: "none", fontWeight: "bold", px: 3 }}
          >
            Create Class
          </Button>
        </Stack>
      </Box>

      {/* Navigation & Controls Section */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={() => handleNavigate("prev")}
              disabled={isLoading}
              sx={{ bgcolor: "action.hover" }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleNavigate("today")}
              disabled={isLoading}
              sx={{ px: 2, textTransform: "none" }}
            >
              Today
            </Button>
            <IconButton
              size="small"
              onClick={() => handleNavigate("next")}
              disabled={isLoading}
              sx={{ bgcolor: "action.hover" }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ ml: 2, fontWeight: "semibold", color: "text.primary" }}
            >
              {isLoading ? <Skeleton width={150} /> : getHeaderTitle()}
            </Typography>
            {isFetching && !isLoading && (
              <RefreshIcon
                sx={{ ml: 1, animation: "spin 1s linear infinite" }}
                fontSize="small"
                color="action"
              />
            )}
          </Stack>

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            size="small"
            disabled={isLoading}
            sx={{
              bgcolor: "action.hover",
              p: 0.5,
              borderRadius: 2,
              "& .MuiToggleButton-root": {
                border: "none",
                px: 2,
                borderRadius: 1.5,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                },
              },
            }}
          >
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Calendar Content */}
      {error ? (
        <Alert
          severity="error"
          variant="outlined"
          sx={{ borderRadius: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          <AlertTitle>Error Loading Schedule</AlertTitle>
          There was an error fetching the class occurrences. Please try again.
        </Alert>
      ) : isLoading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Skeleton
            variant="rectangular"
            height={600}
            sx={{ borderRadius: 3 }}
          />
        </Box>
      ) : (
        <CalendarGrid
          view={view}
          currentDate={currentDate}
          occurrences={occurrences}
        />
      )}

      <CreateClassModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};

export default CalendarPage;
