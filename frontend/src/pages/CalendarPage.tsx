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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import CalendarGrid from "../components/CalendarGrid";
import ClassListView from "../components/ClassListView";
import CreateClassModal from "../components/CreateClassModal";
import {
  CalendarMonth as CalendarIcon,
  List as ListIcon,
} from "@mui/icons-material";

import { useGetOccurrencesQuery } from "../services/classesApi";

const CalendarPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [displayMode, setDisplayMode] = useState<"calendar" | "list">(
    "calendar",
  );
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

  const occurrences = useMemo(() => {
    const data = response?.data || [];
    if (!search) return data;

    const searchLower = search.toLowerCase();
    return data.filter(
      (occ) =>
        occ.className?.toLowerCase().includes(searchLower) ||
        occ.instructorName?.toLowerCase().includes(searchLower) ||
        occ.roomName?.toLowerCase().includes(searchLower),
    );
  }, [response, search]);

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextView: "day" | "week" | "month",
  ) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const handleDisplayModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextMode: "calendar" | "list",
  ) => {
    if (nextMode !== null) {
      setDisplayMode(nextMode);
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
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
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
              fontSize: { xs: "1.75rem", md: "2.125rem" },
            }}
          >
            Class Schedule
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
            Manage and view all upcoming class occurrences.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-between", sm: "flex-end" },
          }}
        >
          <TextField
            size="small"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 200, md: 250 },
              display: { xs: "none", sm: "block" }, // Hide search on mobile header, maybe move it elsewhere
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
            fullWidth={false}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              px: { xs: 2, md: 3 },
              whiteSpace: "nowrap",
            }}
          >
            Create Class
          </Button>
        </Stack>
      </Box>

      {/* Mobile Search - only visible on xs */}
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
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
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
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
              sx={{
                ml: { xs: 1, sm: 2 },
                fontWeight: "semibold",
                color: "text.primary",
                fontSize: { xs: "1rem", sm: "1.25rem" },
                whiteSpace: "nowrap",
              }}
            >
              {isLoading ? <Skeleton width={100} /> : getHeaderTitle()}
            </Typography>
            {isFetching && !isLoading && (
              <RefreshIcon
                sx={{ ml: 1, animation: "spin 1s linear infinite" }}
                fontSize="small"
                color="action"
              />
            )}
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <ToggleButtonGroup
              value={displayMode}
              exclusive
              onChange={handleDisplayModeChange}
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
                    bgcolor: "background.paper",
                    color: "primary.main",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    "&:hover": {
                      bgcolor: "background.paper",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="calendar">
                <CalendarIcon sx={{ mr: 1, fontSize: 18 }} />
                Calendar
              </ToggleButton>
              <ToggleButton value="list">
                <ListIcon sx={{ mr: 1, fontSize: 18 }} />
                List
              </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              size="small"
              disabled={isLoading}
              fullWidth={isMobile}
              sx={{
                bgcolor: "action.hover",
                p: 0.5,
                borderRadius: 2,
                width: { xs: "100%", sm: "auto" },
                "& .MuiToggleButton-root": {
                  border: "none",
                  flex: { xs: 1, sm: "initial" },
                  px: { xs: 1, sm: 2 },
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
          </Stack>
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
      ) : displayMode === "calendar" ? (
        <CalendarGrid
          view={view}
          currentDate={currentDate}
          occurrences={occurrences}
        />
      ) : (
        <ClassListView occurrences={occurrences} />
      )}

      <CreateClassModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};

export default CalendarPage;
