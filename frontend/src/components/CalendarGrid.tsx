import React from "react";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import { DateTime, Info } from "luxon";
import { motion } from "framer-motion";
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
  const getEventsForDate = (date: DateTime) => {
    return occurrences.filter((occ) => {
      const occStart = DateTime.fromISO(occ.startAt);
      return occStart.hasSame(date, "day");
    });
  };

  const renderMonthView = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startOfCalendar = startOfMonth
      .minus({ days: startOfMonth.weekday % 7 })
      .startOf("day");
    const endOfCalendar = endOfMonth
      .plus({ days: 6 - (endOfMonth.weekday % 7) })
      .endOf("day");

    const days: DateTime[] = [];
    let day = startOfCalendar;
    while (day <= endOfCalendar || days.length < 35) {
      days.push(day);
      day = day.plus({ days: 1 });
    }

    const weekdays = Info.weekdays("short");
    const sundayStartWeekdays = [weekdays[6], ...weekdays.slice(0, 6)];

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(7, minmax(100px, 1fr))",
            md: "repeat(7, 1fr)",
          },
          rowGap: "1px",
          columnGap: "1px",
          bgcolor: "divider",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          overflowX: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {sundayStartWeekdays.map((day) => (
          <Box
            key={day}
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.02)",
              p: { xs: 1, md: 2 },
              textAlign: "center",
              minWidth: { xs: 100, md: "auto" },
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: "800",
                textTransform: "uppercase",
                fontSize: { xs: "0.65rem", md: "0.7rem" },
                letterSpacing: "0.1em",
              }}
            >
              {day}
            </Typography>
          </Box>
        ))}
        {days.map((d, index) => {
          const events = getEventsForDate(d);
          const isCurrentMonth = d.month === currentDate.month;
          const isToday = d.hasSame(DateTime.now(), "day");

          return (
            <Box
              key={d.toISODate()}
              component={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              sx={{
                bgcolor: isToday
                  ? (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(25, 118, 210, 0.15)"
                        : "rgba(25, 118, 210, 0.04)"
                  : "background.paper",
                minHeight: { xs: 100, md: 140 },
                minWidth: { xs: 100, md: "auto" },
                p: { xs: 0.5, md: 1.5 },
                transition: "all 0.2s ease",
                position: "relative",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.01)",
                  zIndex: 1,
                },
                opacity: isCurrentMonth ? 1 : 0.4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isToday ? "800" : "500",
                    color: isToday ? "primary.main" : "text.secondary",
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    bgcolor: isToday ? "primary.lighter" : "transparent",
                  }}
                >
                  {d.day}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                {events.slice(0, isMobile ? 2 : 3).map((occ) => (
                  <EventCard
                    key={occ.startAt + occ.classId}
                    occurrence={occ}
                    isCompact
                  />
                ))}
                {events.length > (isMobile ? 2 : 3) && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "primary.main",
                      fontWeight: "700",
                      textAlign: "center",
                      display: "block",
                      mt: 0.5,
                      bgcolor: "primary.lighter",
                      borderRadius: 1,
                      py: 0.25,
                      fontSize: "0.65rem",
                    }}
                  >
                    + {events.length - (isMobile ? 2 : 3)} more
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = currentDate
      .minus({ days: currentDate.weekday % 7 })
      .startOf("day");
    const days = Array.from({ length: 7 }, (_, i) =>
      startOfWeek.plus({ days: i }),
    );

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(7, minmax(140px, 1fr))",
            md: "repeat(7, 1fr)",
          },
          bgcolor: "divider",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
          overflow: "hidden",
          overflowX: "auto",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.3)"
              : "0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        {days.map((d, index) => {
          const events = getEventsForDate(d);
          const isToday = d.hasSame(DateTime.now(), "day");

          return (
            <Box
              key={d.toISODate()}
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: { xs: 140, md: "auto" },
                bgcolor: "background.paper",
                "&:not(:last-child)": {
                  borderRight: "1px solid",
                  borderColor: "divider",
                },
              }}
            >
              <Box
                sx={{
                  p: 2.5,
                  textAlign: "center",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  bgcolor: isToday
                    ? (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(25, 118, 210, 0.12)"
                          : "rgba(25, 118, 210, 0.04)"
                    : (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.01)"
                          : "rgba(0,0,0,0.01)",
                  position: "relative",
                  "&::after": isToday
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: -1,
                        left: "20%",
                        right: "20%",
                        height: 3,
                        bgcolor: "primary.main",
                        borderRadius: "3px 3px 0 0",
                      }
                    : {},
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: isToday ? "primary.main" : "text.secondary",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    display: "block",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    mb: 0.5,
                  }}
                >
                  {d.toFormat("ccc")}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "900",
                    color: isToday ? "primary.main" : "text.primary",
                    fontSize: { xs: "1.5rem", md: "1.75rem" },
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {d.day}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minHeight: { xs: 500, md: 700 },
                  p: 2,
                  bgcolor: isToday
                    ? (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(25, 118, 210, 0.02)"
                          : "rgba(25, 118, 210, 0.01)"
                    : "transparent",
                }}
              >
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
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0.15,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, textTransform: "uppercase" }}
                    >
                      No Classes
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 15 }, (_, i) => i + 7);
    const events = getEventsForDate(currentDate);

    return (
      <Box
        sx={{
          display: "flex",
          gap: { xs: 0, md: 4 },
          bgcolor: "background.paper",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.2)"
              : "0 8px 32px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: { xs: 70, md: 100 },
            display: "flex",
            flexDirection: "column",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.01)",
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: 100,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                pt: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.7rem", md: "0.8rem" },
                  fontWeight: "800",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {hour === 12
                  ? "12 PM"
                  : hour > 12
                    ? `${hour - 12} PM`
                    : `${hour} AM`}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            flex: 1,
            position: "relative",
            minHeight: hours.length * 100,
          }}
        >
          {hours.map((hour) => (
            <Box
              key={`line-${hour}`}
              sx={{
                position: "absolute",
                top: (hour - 7) * 100,
                left: 0,
                right: 0,
                height: "1px",
                bgcolor: "divider",
                opacity: 0.5,
              }}
            />
          ))}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: { xs: 2, md: 3 },
              position: "relative",
              zIndex: 1,
            }}
          >
            {events.length > 0 ? (
              events.map((occ, index) => {
                const start = DateTime.fromISO(occ.startAt);
                const hourOffset = start.hour - 7 + start.minute / 60;
                return (
                  <Box
                    key={occ.startAt + occ.classId}
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    sx={{
                      position: "absolute",
                      top: hourOffset * 100,
                      left: { xs: 8, md: 24 },
                      right: { xs: 8, md: 24 },
                      zIndex: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "primary.main",
                        fontWeight: "900",
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                        }}
                      />
                      {start.toLocaleString(DateTime.TIME_SIMPLE)}
                    </Typography>
                    <EventCard occurrence={occ} isCompact={false} />
                  </Box>
                );
              })
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 400,
                  opacity: 0.2,
                  mt: 10,
                }}
              >
                <Typography variant="h5" fontWeight="900" sx={{ mb: 1 }}>
                  Free Day
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  No classes scheduled for this date
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
