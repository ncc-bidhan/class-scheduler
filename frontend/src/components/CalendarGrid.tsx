import React from "react";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import { DateTime, Info } from "luxon";
import type { Occurrence } from "../types";
import EventCard from "./EventCard";

interface CalendarGridProps {
  view: "day" | "week" | "month";
  currentDate: DateTime;
  occurrences: Occurrence[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  view,
  currentDate,
  occurrences,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Helper to filter occurrences for a specific date
  const getEventsForDate = (date: DateTime) => {
    return occurrences.filter((occ) => {
      const occStart = DateTime.fromISO(occ.startAt);
      return occStart.hasSame(date, "day");
    });
  };

  // Month View: 7x5 or 7x6 grid
  const renderMonthView = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startOfCalendar = startOfMonth.startOf("week");
    const endOfCalendar = endOfMonth.endOf("week");

    const days: DateTime[] = [];
    let day = startOfCalendar;
    while (day <= endOfCalendar || days.length < 35) {
      days.push(day);
      day = day.plus({ days: 1 });
    }

    const weekdays = Info.weekdays("short");

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(7, minmax(100px, 1fr))",
            md: "repeat(7, 1fr)",
          },
          gap: "1px",
          bgcolor: "divider",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflowX: "auto",
        }}
      >
        {weekdays.map((day) => (
          <Box
            key={day}
            sx={{
              bgcolor: "background.paper",
              p: { xs: 1, md: 2 },
              textAlign: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
              minWidth: { xs: 100, md: "auto" },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: { xs: "0.65rem", md: "0.75rem" },
              }}
            >
              {day}
            </Typography>
          </Box>
        ))}
        {days.map((d) => {
          const events = getEventsForDate(d);
          const isCurrentMonth = d.month === currentDate.month;
          const isToday = d.hasSame(DateTime.now(), "day");

          return (
            <Box
              key={d.toISODate()}
              sx={{
                bgcolor: isToday
                  ? (theme) =>
                      theme.palette.mode === "dark" ? "#1a237e" : "#e8eaf6"
                  : "background.paper",
                minHeight: { xs: 100, md: 120 },
                minWidth: { xs: 100, md: "auto" },
                p: { xs: 0.5, md: 2 },
                transition: "background-color 0.2s",
                "&:hover": {
                  bgcolor: "action.hover",
                },
                opacity: isCurrentMonth ? 1 : 0.4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isToday ? "bold" : "normal",
                    color: isToday ? "primary.main" : "text.primary",
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                  }}
                >
                  {d.day}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {events.slice(0, isMobile ? 2 : 4).map((occ) => (
                  <EventCard
                    key={occ.startAt + occ.classId}
                    occurrence={occ}
                    isCompact
                  />
                ))}
                {events.length > (isMobile ? 2 : 4) && (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", pl: 0.5 }}
                  >
                    + {events.length - (isMobile ? 2 : 4)} more
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  // Week View: 7 columns for days
  const renderWeekView = () => {
    const startOfWeek = currentDate.startOf("week");
    const days = Array.from({ length: 7 }, (_, i) =>
      startOfWeek.plus({ days: i }),
    );

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(7, minmax(120px, 1fr))",
            md: "repeat(7, 1fr)",
          },
          gap: { xs: 1, md: 2 },
          overflowX: "auto",
          pb: 1,
        }}
      >
        {days.map((d) => {
          const events = getEventsForDate(d);
          const isToday = d.hasSame(DateTime.now(), "day");

          return (
            <Box
              key={d.toISODate()}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1, md: 2 },
                minWidth: { xs: 120, md: "auto" },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1, md: 1.5 },
                  border: "1px solid",
                  textAlign: "center",
                  borderRadius: 2,
                  ...(isToday
                    ? {
                        bgcolor: "primary.main",
                        borderColor: "primary.main",
                        color: "primary.contrastText",
                      }
                    : {
                        bgcolor: "background.paper",
                        borderColor: "divider",
                      }),
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: isToday ? "inherit" : "text.secondary",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    display: "block",
                    fontSize: { xs: "0.65rem", md: "0.75rem" },
                  }}
                >
                  {d.toFormat("ccc")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "inherit",
                    fontSize: { xs: "1rem", md: "1.25rem" },
                  }}
                >
                  {d.day}
                </Typography>
              </Paper>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  minHeight: { xs: 300, md: 500 },
                  bgcolor: "action.hover",
                  borderRadius: 3,
                  p: 1,
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                {events.map((occ) => (
                  <EventCard
                    key={occ.startAt + occ.classId}
                    occurrence={occ}
                    isCompact={isMobile}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  // Day View: Time slots vertically
  const renderDayView = () => {
    const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM
    const events = getEventsForDate(currentDate);

    return (
      <Box sx={{ display: "flex", gap: { xs: 1, md: 4 } }}>
        <Box
          sx={{
            width: { xs: 60, md: 80 },
            display: "flex",
            flexDirection: "column",
            gap: 5,
            pt: 5,
          }}
        >
          {hours.map((hour) => (
            <Typography
              key={hour}
              variant="caption"
              sx={{
                color: "text.secondary",
                display: "block",
                textAlign: "right",
                pr: { xs: 1, md: 2 },
                fontSize: { xs: "0.65rem", md: "0.75rem" },
              }}
            >
              {hour === 12
                ? "12 PM"
                : hour > 12
                  ? `${hour - 12} PM`
                  : `${hour} AM`}
            </Typography>
          ))}
        </Box>
        <Box
          sx={{
            flex: 1,
            position: "relative",
            bgcolor: "action.hover",
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
            p: { xs: 1, md: 2 },
            minHeight: 600,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {events.length > 0 ? (
              events.map((occ) => (
                <EventCard
                  key={occ.startAt + occ.classId}
                  occurrence={occ}
                  isCompact={isMobile}
                />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  opacity: 0.3,
                  py: 10,
                }}
              >
                <Typography variant="body1">
                  No classes scheduled for today
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      {view === "month" && renderMonthView()}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}
    </Box>
  );
};

export default CalendarGrid;
