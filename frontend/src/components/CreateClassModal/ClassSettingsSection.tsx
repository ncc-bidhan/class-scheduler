import React from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@mui/material";
import {
  PeopleOutlined as People,
  InfoOutlined as Info,
} from "@mui/icons-material";
import type { CreateClassFormData } from "./types";

interface ClassSettingsSectionProps {
  formData: CreateClassFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors: Record<string, string>;
}

const ClassSettingsSection: React.FC<ClassSettingsSectionProps> = ({
  formData,
  handleInputChange,
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
        Class Settings
      </Typography>
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Duration"
            name="durationMinutes"
            type="number"
            value={formData.durationMinutes}
            onChange={handleInputChange}
            error={!!fieldErrors.durationMinutes}
            helperText={fieldErrors.durationMinutes}
            required
            InputProps={{
              endAdornment: (
                <Typography variant="body2" color="text.secondary">
                  min
                </Typography>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleInputChange}
            error={!!fieldErrors.capacity}
            helperText={fieldErrors.capacity}
            required
            InputProps={{
              startAdornment: <People sx={{ mr: 1, color: "action.active" }} />,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Waitlist Capacity"
            name="waitlistCapacity"
            type="number"
            value={formData.waitlistCapacity}
            onChange={handleInputChange}
            error={!!fieldErrors.waitlistCapacity}
            helperText={fieldErrors.waitlistCapacity}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <FormControlLabel
              control={
                <Switch
                  name="allowDropIn"
                  checked={formData.allowDropIn}
                  onChange={handleInputChange}
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography variant="body2">Allow Drop-ins</Typography>
                  <Tooltip title="Enable walk-in registrations without prior booking">
                    <Info sx={{ fontSize: 16, color: "action.active" }} />
                  </Tooltip>
                </Box>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ClassSettingsSection;
