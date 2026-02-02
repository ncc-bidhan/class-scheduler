import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  TextField,
  Chip,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import {
  AddOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EventNoteOutlined as EventNoteIcon,
} from "@mui/icons-material";
import { DateTime, Info } from "luxon";
import { RRule } from "rrule";
import type { TimeSlot, Recurrence } from "../types";

interface RecurrenceEditorProps {
  dtstart: DateTime;
  until: DateTime | null;
  value: Recurrence;
  onChange: (value: Recurrence) => void;
}

const DAYS_OF_WEEK = Info.weekdays("short").map((name, index) => ({
  name,
  value: index + 1 === 7 ? 0 : index + 1,
}));

const SUNDAY_START_DAYS = [DAYS_OF_WEEK[6], ...DAYS_OF_WEEK.slice(0, 6)];

const RecurrenceEditor: React.FC<RecurrenceEditorProps> = ({
  dtstart,
  until,
  value,
  onChange,
}) => {
  const [freq, setFreq] = useState<Recurrence["freq"]>(value.freq || "weekly");
  const [interval, setInterval] = useState(value.interval || 1);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    value.timeSlots || [{ startTime: "09:00", endTime: "10:00" }],
  );
  const [byWeekday, setByWeekday] = useState<number[]>(
    value.byWeekday || [dtstart.weekday % 7],
  );
  const [timeSlotsByWeekday, setTimeSlotsByWeekday] = useState<
    Record<string, TimeSlot[]>
  >(value.timeSlotsByWeekday || {});
  const [byMonthDay, setByMonthDay] = useState<number[]>(
    value.byMonthDay || [dtstart.day],
  );
  const [rrule, setRrule] = useState(value.rrule || "");

  useEffect(() => {
    onChange({
      freq,
      interval,
      timeSlots,
      byWeekday,
      timeSlotsByWeekday,
      byMonthDay,
      rrule,
    });
  }, [
    freq,
    interval,
    timeSlots,
    byWeekday,
    timeSlotsByWeekday,
    byMonthDay,
    rrule,
  ]);

  const handleAddTimeSlot = (
    targetSlots: TimeSlot[],
    setTarget: (s: TimeSlot[]) => void,
  ) => {
    const last = targetSlots[targetSlots.length - 1];
    const newStart = last ? last.endTime : "09:00";
    const [h, m] = newStart.split(":").map(Number);
    const end = DateTime.fromObject({ hour: h, minute: m })
      .plus({ hours: 1 })
      .toFormat("HH:mm");
    setTarget([...targetSlots, { startTime: newStart, endTime: end }]);
  };

  const handleRemoveTimeSlot = (
    index: number,
    targetSlots: TimeSlot[],
    setTarget: (s: TimeSlot[]) => void,
  ) => {
    setTarget(targetSlots.filter((_, i) => i !== index));
  };

  const handleSlotChange = (
    index: number,
    field: keyof TimeSlot,
    val: string,
    targetSlots: TimeSlot[],
    setTarget: (s: TimeSlot[]) => void,
  ) => {
    const next = [...targetSlots];
    next[index] = { ...next[index], [field]: val };
    setTarget(next);
  };

  const renderTimeSlotEditor = (
    slots: TimeSlot[],
    setTarget: (s: TimeSlot[]) => void,
    label = "Time Slots",
  ) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleAddTimeSlot(slots, setTarget)}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      {slots.map((slot, idx) => (
        <Box
          key={idx}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <TextField
            type="time"
            size="small"
            value={slot.startTime}
            onChange={(e) =>
              handleSlotChange(
                idx,
                "startTime",
                e.target.value,
                slots,
                setTarget,
              )
            }
            inputProps={{ step: 300 }}
            sx={{ flex: { xs: 1, sm: "initial" } }}
          />
          <Typography sx={{ display: { xs: "none", sm: "block" } }}>
            -
          </Typography>
          <TextField
            type="time"
            size="small"
            value={slot.endTime}
            onChange={(e) =>
              handleSlotChange(idx, "endTime", e.target.value, slots, setTarget)
            }
            inputProps={{ step: 300 }}
            sx={{ flex: { xs: 1, sm: "initial" } }}
          />
          <IconButton
            size="small"
            color="error"
            disabled={slots.length <= 1}
            onClick={() => handleRemoveTimeSlot(idx, slots, setTarget)}
            sx={{ ml: { xs: "auto", sm: 0 } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Box>
  );

  const previewOccurrences = useMemo(() => {
    const max = 5;
    const occurrences: { start: DateTime; end: DateTime }[] = [];
    const from = dtstart;
    const to = until || dtstart.plus({ months: 12 });

    const parseHHMM = (s: string) => {
      const [h, m] = s.split(":").map(Number);
      return { h, m };
    };

    const makeRange = (date: DateTime, slot: TimeSlot) => {
      const { h: sh, m: sm } = parseHHMM(slot.startTime);
      const { h: eh, m: em } = parseHHMM(slot.endTime);
      return {
        start: date.set({ hour: sh, minute: sm, second: 0, millisecond: 0 }),
        end: date.set({ hour: eh, minute: em, second: 0, millisecond: 0 }),
      };
    };

    if (freq === "daily") {
      let cursor = from.startOf("day");
      while (occurrences.length < max && cursor <= to) {
        for (const slot of timeSlots) {
          const range = makeRange(cursor, slot);
          if (range.start >= from && range.start <= to) {
            occurrences.push(range);
            if (occurrences.length >= max) break;
          }
        }
        cursor = cursor.plus({ days: interval });
      }
    } else if (freq === "weekly") {
      let cursor = from.startOf("day");
      const selectedWds = new Set(byWeekday);
      while (occurrences.length < max && cursor <= to) {
        const wd = cursor.weekday % 7;
        if (selectedWds.has(wd)) {
          const weekDiff = Math.floor(
            cursor
              .minus({ days: cursor.weekday % 7 })
              .startOf("day")
              .diff(
                from.minus({ days: from.weekday % 7 }).startOf("day"),
                "weeks",
              ).weeks,
          );
          if (weekDiff % interval === 0) {
            const slots = timeSlotsByWeekday[String(wd)] || [];
            for (const slot of slots) {
              const range = makeRange(cursor, slot);
              if (range.start >= from && range.start <= to) {
                occurrences.push(range);
                if (occurrences.length >= max) break;
              }
            }
          }
        }
        cursor = cursor.plus({ days: 1 });
      }
    } else if (freq === "monthly") {
      let cursorMonth = from.startOf("month");
      while (occurrences.length < max && cursorMonth <= to) {
        const monthDiff = Math.floor(
          cursorMonth.diff(from.startOf("month"), "months").months,
        );
        if (monthDiff % interval === 0) {
          for (const dom of byMonthDay) {
            const date = cursorMonth.set({ day: dom });
            if (date.isValid) {
              for (const slot of timeSlots) {
                const range = makeRange(date, slot);
                if (range.start >= from && range.start <= to) {
                  occurrences.push(range);
                  if (occurrences.length >= max) break;
                }
              }
            }
          }
        }
        cursorMonth = cursorMonth.plus({ months: 1 });
      }
    } else if (freq === "custom" && rrule) {
      try {
        const rule = RRule.fromString(rrule);
        const dates = rule.all((_, i) => i < max);
        for (const d of dates) {
          const day = DateTime.fromJSDate(d).startOf("day");
          for (const slot of timeSlots) {
            occurrences.push(makeRange(day, slot));
          }
        }
      } catch (e) {
      }
    }

    return occurrences
      .sort((a, b) => a.start.toMillis() - b.start.toMillis())
      .slice(0, max);
  }, [
    freq,
    interval,
    timeSlots,
    byWeekday,
    timeSlotsByWeekday,
    byMonthDay,
    rrule,
    dtstart,
    until,
  ]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          p: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.02)",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" fontWeight="700">
          Frequency:
        </Typography>
        <ToggleButtonGroup
          value={freq}
          exclusive
          size="small"
          fullWidth
          onChange={(_, val) => val && setFreq(val)}
          sx={{
            flexWrap: { xs: "wrap", sm: "nowrap" },
            gap: 1,
            "& .MuiToggleButtonGroup-grouped": {
              border: 0,
              borderRadius: 1.5,
              "&:not(:first-of-type)": {
                borderRadius: 1.5,
              },
              "&:first-of-type": {
                borderRadius: 1.5,
              },
            },
            "& .MuiToggleButton-root": {
              flex: { xs: 1, sm: "initial" },
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderColor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              },
            },
          }}
        >
          <ToggleButton value="daily">Daily</ToggleButton>
          <ToggleButton value="weekly">Weekly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
          <ToggleButton value="custom">Custom</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
          gap: 3,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {freq !== "custom" && (
            <TextField
              label="Interval"
              type="number"
              size="small"
              fullWidth
              value={interval}
              onChange={(e) => setInterval(Math.max(1, Number(e.target.value)))}
              helperText={`Every ${interval} ${freq === "daily" ? "day(s)" : freq === "weekly" ? "week(s)" : "month(s)"}`}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />
          )}

          {freq === "daily" && renderTimeSlotEditor(timeSlots, setTimeSlots)}

          {freq === "weekly" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Typography variant="subtitle2" fontWeight="700">
                Weekdays:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {SUNDAY_START_DAYS.map((d) => {
                  const isSelected = byWeekday.includes(d.value);
                  return (
                    <Chip
                      key={d.value}
                      label={d.name}
                      onClick={() =>
                        setByWeekday((prev) =>
                          isSelected
                            ? prev.filter((v) => v !== d.value)
                            : [...prev, d.value],
                        )
                      }
                      color={isSelected ? "primary" : "default"}
                      variant={isSelected ? "filled" : "outlined"}
                      sx={{
                        borderRadius: 1.5,
                        fontWeight: 600,
                        px: 1,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                        },
                      }}
                    />
                  );
                })}
              </Box>
              <Divider sx={{ my: 1, opacity: 0.6 }} />
              <Stack spacing={2}>
                {byWeekday
                  .slice()
                  .sort((a, b) => {
                    const aVal = a === 0 ? 7 : a;
                    const bVal = b === 0 ? 7 : b;
                    const aOrder = a === 0 ? -1 : a;
                    const bOrder = b === 0 ? -1 : b;
                    return aOrder - bOrder;
                  })
                  .map((wd) => (
                    <Box
                      key={wd}
                      sx={{
                        p: 2.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.01)",
                      }}
                    >
                      {renderTimeSlotEditor(
                        timeSlotsByWeekday[String(wd)] || [
                          { startTime: "09:00", endTime: "10:00" },
                        ],
                        (newSlots) =>
                          setTimeSlotsByWeekday((prev) => ({
                            ...prev,
                            [String(wd)]: newSlots,
                          })),
                        `Slots for ${SUNDAY_START_DAYS.find((d) => d.value === wd)?.name}`,
                      )}
                    </Box>
                  ))}
              </Stack>
            </Box>
          )}

          {freq === "monthly" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Days of Month"
                placeholder="e.g. 1, 15, 31"
                size="small"
                fullWidth
                value={byMonthDay.join(", ")}
                onChange={(e) =>
                  setByMonthDay(
                    e.target.value
                      .split(",")
                      .map((v) => parseInt(v.trim()))
                      .filter((v) => !isNaN(v) && v >= 1 && v <= 31),
                  )
                }
                helperText="Comma separated days (1-31)"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
              {renderTimeSlotEditor(timeSlots, setTimeSlots)}
            </Box>
          )}

          {freq === "custom" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="RRULE String"
                multiline
                rows={2}
                fullWidth
                value={rrule}
                onChange={(e) => setRrule(e.target.value)}
                placeholder="FREQ=WEEKLY;BYDAY=MO,WE,FR"
                helperText="Standard RRULE format"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
              {renderTimeSlotEditor(timeSlots, setTimeSlots)}
            </Box>
          )}
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            height: "fit-content",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="800"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "uppercase",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              color: "text.secondary",
              mb: 2,
            }}
          >
            <EventNoteIcon
              fontSize="small"
              sx={{ mr: 1, color: "primary.main" }}
            />{" "}
            Preview (Next 5)
          </Typography>
          <Stack spacing={1.5}>
            {previewOccurrences.length > 0 ? (
              previewOccurrences.map((occ, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 1.5,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  }}
                >
                  <Typography variant="body2" fontWeight="600">
                    {occ.start.toFormat("ccc, MMM d")}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: "700",
                      color: "primary.main",
                      bgcolor: "primary.lighter",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {occ.start.toFormat("HH:mm")} - {occ.end.toFormat("HH:mm")}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ fontStyle: "italic", textAlign: "center", py: 2 }}
              >
                No occurrences found in range or invalid pattern.
              </Typography>
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default RecurrenceEditor;
