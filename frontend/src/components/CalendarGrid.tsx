import React from "react";
import { Box, Typography, Paper } from "@mui/material";
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
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "1px",
          bgcolor: "divider",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {weekdays.map((day) => (
          <Box
            key={day}
            sx={{
              bgcolor: "background.paper",
              p: 2,
              textAlign: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: "bold",
                textTransform: "uppercase",
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
                bgcolor: "background.paper",
                minHeight: 120,
                p: 2,
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
                  alignItems: "start",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: "medium",
                    ...(isToday
                      ? {
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                        }
                      : {
                          color: "text.secondary",
                        }),
                  }}
                >
                  {d.day}
                </Typography>
              </Box>
              <Box
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}
              >
                {events.map((occ) => (
                  <EventCard
                    key={occ.startAt + occ.classId}
                    occurrence={occ}
                    isCompact
                  />
                ))}
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
        sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}
      >
        {days.map((d) => {
          const events = getEventsForDate(d);
          const isToday = d.hasSame(DateTime.now(), "day");

          return (
            <Box
              key={d.toISODate()}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
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
                  }}
                >
                  {d.toFormat("ccc")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "inherit" }}
                >
                  {d.day}
                </Typography>
              </Paper>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  minHeight: 500,
                  bgcolor: "action.hover",
                  borderRadius: 3,
                  p: 1,
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                {events.map((occ) => (
                  <EventCard key={occ.startAt + occ.classId} occurrence={occ} />
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
      <Box sx={{ display: "flex", gap: 4 }}>
        <Box
          sx={{
            width: 80,
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
                pr: 2,
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
            p: 2,
            minHeight: 600,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {events.length > 0 ? (
              events.map((occ) => (
                <EventCard key={occ.startAt + occ.classId} occurrence={occ} />
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
