import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  TextField,
  Grid,
  Chip,
  Paper,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  EventNote as EventNoteIcon,
} from "@mui/icons-material";
import { DateTime, Info } from "luxon";
import { RRule } from "rrule";
import type { TimeSlot, Recurrence } from "../types";

interface RecurrenceEditorProps {
  dtstart: DateTime;
  until: DateTime | null;
  timezone: string;
  value: Recurrence;
  onChange: (value: Recurrence) => void;
}

const DAYS_OF_WEEK = Info.weekdays("short").map((name, index) => ({
  name,
  value: (index + 1) % 7, // 1=Mon...7=Sun -> 0=Sun...6=Sat
}));

const RecurrenceEditor: React.FC<RecurrenceEditorProps> = ({
  dtstart,
  until,
  timezone,
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

  // Update parent when local state changes
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

  // PREVIEW LOGIC
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
            cursor.startOf("week").diff(from.startOf("week"), "weeks").weeks,
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
        const dates = rule.all((d, i) => i < max);
        for (const d of dates) {
          const day = DateTime.fromJSDate(d, { zone: timezone }).startOf("day");
          for (const slot of timeSlots) {
            occurrences.push(makeRange(day, slot));
          }
        }
      } catch (e) {
        // Invalid rrule
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
    timezone,
  ]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Typography variant="subtitle2">Frequency:</Typography>
        <ToggleButtonGroup
          value={freq}
          exclusive
          size="small"
          fullWidth
          onChange={(_, val) => val && setFreq(val)}
          sx={{
            flexWrap: { xs: "wrap", sm: "nowrap" },
            "& .MuiToggleButton-root": {
              flex: { xs: 1, sm: "initial" },
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
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {freq !== "custom" && (
            <TextField
              label="Interval"
              type="number"
              size="small"
              fullWidth
              value={interval}
              onChange={(e) => setInterval(Math.max(1, Number(e.target.value)))}
              helperText={`Every ${interval} ${freq === "daily" ? "day(s)" : freq === "weekly" ? "week(s)" : "month(s)"}`}
            />
          )}

          {freq === "daily" && renderTimeSlotEditor(timeSlots, setTimeSlots)}

          {freq === "weekly" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle2">Weekdays:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {DAYS_OF_WEEK.map((d) => {
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
                    />
                  );
                })}
              </Box>
              <Divider />
              {byWeekday.sort().map((wd) => (
                <Box
                  key={wd}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "action.hover",
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
                    `Slots for ${DAYS_OF_WEEK.find((d) => d.value === wd)?.name}`,
                  )}
                </Box>
              ))}
            </Box>
          )}

          {freq === "monthly" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              />
              {renderTimeSlotEditor(timeSlots, setTimeSlots)}
            </Box>
          )}

          {freq === "custom" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="RRULE String"
                multiline
                rows={2}
                fullWidth
                value={rrule}
                onChange={(e) => setRrule(e.target.value)}
                placeholder="FREQ=WEEKLY;BYDAY=MO,WE,FR"
                helperText="Standard RRULE format"
              />
              {renderTimeSlotEditor(timeSlots, setTimeSlots)}
            </Box>
          )}
        </Box>

        <Paper variant="outlined" sx={{ p: 2, bgcolor: "action.hover" }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <EventNoteIcon fontSize="small" sx={{ mr: 1 }} /> Preview (Next 5)
          </Typography>
          <Stack spacing={1}>
            {previewOccurrences.length > 0 ? (
              previewOccurrences.map((occ, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    {occ.start.toFormat("ccc, MMM d")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    {occ.start.toFormat("HH:mm")} - {occ.end.toFormat("HH:mm")}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ fontStyle: "italic" }}
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
