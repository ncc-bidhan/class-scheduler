import React from "react";
import { Paper, Typography, Grid, Divider, Box } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateTime } from "luxon";
import RecurrenceEditor from "../RecurrenceEditor";
import type { CreateClassFormData } from "./types";
import type { Recurrence } from "../../types";

interface ScheduleSectionProps {
  type: "single" | "recurring";
  formData: CreateClassFormData;
  setFormData: React.Dispatch<React.SetStateAction<CreateClassFormData>>;
  fieldErrors: Record<string, string>;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  type,
  formData,
  setFormData,
  fieldErrors,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.02)"
            : "rgba(0,0,0,0.01)",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="800"
        gutterBottom
        color="primary"
        sx={{
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          mb: 2,
        }}
      >
        {type === "single" ? "Schedule" : "Recurrence Schedule"}
      </Typography>
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        {type === "single" ? (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateTimePicker
                label="Start Time"
                value={formData.startAt.toJSDate()}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    startAt: date
                      ? DateTime.fromJSDate(date as Date)
                      : prev.startAt,
                  }))
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldErrors.startAt,
                    helperText: fieldErrors.startAt,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateTimePicker
                label="End Time"
                value={formData.endAt.toJSDate()}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    endAt: date
                      ? DateTime.fromJSDate(date as Date)
                      : prev.endAt,
                  }))
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldErrors.endAt,
                    helperText: fieldErrors.endAt,
                  },
                }}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateTimePicker
                label="Pattern Start"
                value={formData.dtstart.toJSDate()}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    dtstart: date
                      ? DateTime.fromJSDate(date as Date)
                      : prev.dtstart,
                  }))
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldErrors.dtstart,
                    helperText: fieldErrors.dtstart,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateTimePicker
                label="Pattern End"
                value={formData.until ? formData.until.toJSDate() : null}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    until: date ? DateTime.fromJSDate(date as Date) : null,
                  }))
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldErrors.until,
                    helperText: fieldErrors.until,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Recurrence Pattern
                </Typography>
                <RecurrenceEditor
                  dtstart={formData.dtstart}
                  until={formData.until}
                  value={formData.recurrence}
                  onChange={(recurrence: Recurrence) =>
                    setFormData((prev) => ({ ...prev, recurrence }))
                  }
                />
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};

export default ScheduleSection;
