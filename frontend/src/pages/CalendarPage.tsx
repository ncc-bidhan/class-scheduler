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
  SearchOutlined as SearchIcon,
  AddOutlined as AddIcon,
  ChevronLeftOutlined as ChevronLeftIcon,
  ChevronRightOutlined as ChevronRightIcon,
} from "@mui/icons-material";

import CalendarGrid from "../components/CalendarGrid";
import ClassListView from "../components/ClassListView";
import CreateClassModal from "../components/CreateClassModal";
import {
  CalendarMonthOutlined as CalendarIcon,
  ListOutlined as ListIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

import { useGetOccurrencesQuery } from "../services/classesApi";

import usePageTitle from "../hooks/usePageTitle";

const CalendarPage: React.FC = () => {
  usePageTitle("Calendar");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [displayMode, setDisplayMode] = useState<"calendar" | "list">(
    "calendar",
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dateRange = useMemo(() => {
    let from: DateTime;
    let to: DateTime;

    switch (view) {
      case "day":
        from = currentDate.startOf("day");
        to = currentDate.endOf("day");
        break;
      case "week":
        from = currentDate
          .minus({ days: currentDate.weekday % 7 })
          .startOf("day");
        to = from.plus({ days: 6 }).endOf("day");
        break;
      case "month":
        const monthStart = currentDate.startOf("month");
        const monthEnd = currentDate.endOf("month");
        from = monthStart
          .minus({ days: monthStart.weekday % 7 })
          .startOf("day");
        to = monthEnd.plus({ days: 6 - (monthEnd.weekday % 7) }).endOf("day");
        break;
      default:
        from = currentDate
          .minus({ days: currentDate.weekday % 7 })
          .startOf("day");
        to = from.plus({ days: 6 }).endOf("day");
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
  } = useGetOccurrencesQuery({
    ...dateRange,
    search: debouncedSearch || undefined,
  });

  const occurrences = useMemo(() => {
    return response?.data || [];
  }, [response]);

  const paginatedOccurrences = useMemo(() => {
    if (displayMode === "calendar") return occurrences;
    const start = page * limit;
    return occurrences.slice(start, start + limit);
  }, [occurrences, displayMode, page, limit]);

  const showLoading = isLoading || (isFetching && occurrences.length === 0);

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
    newMode: "calendar" | "list" | null,
  ) => {
    if (newMode !== null) {
      setDisplayMode(newMode);
      if (newMode === "list") {
        setPage(0);
      }
    }
  };

  const handleNavigate = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setCurrentDate(DateTime.now());
    } else {
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
    }
    setPage(0);
  };

  const getHeaderTitle = () => {
    switch (view) {
      case "day":
        return currentDate.toLocaleString(DateTime.DATE_HUGE);
      case "week":
        const start = currentDate
          .minus({ days: currentDate.weekday % 7 })
          .startOf("day");
        const end = start.plus({ days: 6 }).endOf("day");
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
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.02)",
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "text.primary",
              letterSpacing: "-0.02em",
            }}
          >
            Class Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and view all upcoming class occurrences
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
              display: { xs: "none", sm: "block" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Create Class
            </Button>
          </motion.div>
        </Stack>
      </Box>

      {/* Control Bar */}
      <Paper
        elevation={0}
        component={motion.div}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          p: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          background: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "white",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "center",
            width: { xs: "100%", md: "auto" },
          }}
        >
          <IconButton
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNavigate("prev")}
            size="small"
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variant="outlined"
            size="small"
            onClick={() => handleNavigate("today")}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 1.5,
              px: 2,
            }}
          >
            Today
          </Button>
          <IconButton
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNavigate("next")}
            size="small"
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <ChevronRightIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              ml: 2,
              fontWeight: "bold",
              minWidth: { md: 240 },
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={getHeaderTitle()}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {getHeaderTitle()}
              </motion.span>
            </AnimatePresence>
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "center",
            width: { xs: "100%", md: "auto" },
          }}
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            size="small"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
              p: 0.5,
              borderRadius: 2,
              "& .MuiToggleButtonGroup-grouped": {
                border: 0,
                "&.Mui-disabled": {
                  border: 0,
                },
                "&:not(:first-of-type)": {
                  borderRadius: 1.5,
                },
                "&:first-of-type": {
                  borderRadius: 1.5,
                },
              },
              "& .MuiToggleButton-root": {
                textTransform: "none",
                fontWeight: "bold",
                px: 2,
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "primary.main",
                  backgroundColor: "background.paper",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "background.paper",
                  },
                },
              },
            }}
          >
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>

          <Box
            sx={{ borderLeft: "1px solid", borderColor: "divider", mx: 1 }}
          />

          <ToggleButtonGroup
            value={displayMode}
            exclusive
            onChange={handleDisplayModeChange}
            size="small"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
              p: 0.5,
              borderRadius: 2,
              "& .MuiToggleButtonGroup-grouped": {
                border: 0,
                "&:not(:first-of-type)": {
                  borderRadius: 1.5,
                },
                "&:first-of-type": {
                  borderRadius: 1.5,
                },
              },
              "& .MuiToggleButton-root": {
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "primary.main",
                  backgroundColor: "background.paper",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "background.paper",
                  },
                },
              },
            }}
          >
            <ToggleButton value="calendar">
              <CalendarIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list">
              <ListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      {/* Calendar Content */}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
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
              There was an error fetching the class occurrences. Please try
              again.
            </Alert>
          </motion.div>
        ) : showLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Skeleton
                variant="rectangular"
                height={600}
                sx={{ borderRadius: 3 }}
              />
            </Box>
          </motion.div>
        ) : displayMode === "calendar" ? (
          <motion.div
            key={`${displayMode}-${view}-${currentDate.toMillis()}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <CalendarGrid
              view={view}
              currentDate={currentDate}
              occurrences={occurrences}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`${displayMode}-${page}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ClassListView
              occurrences={paginatedOccurrences}
              pagination={{
                page: page + 1,
                limit,
                total: occurrences.length,
                onPageChange: (newPage) => setPage(newPage - 1),
                onRowsPerPageChange: (newLimit) => {
                  setLimit(newLimit);
                  setPage(0);
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CreateClassModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};

export default CalendarPage;
