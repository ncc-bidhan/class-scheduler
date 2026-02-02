import React from "react";
import { Paper, Typography, Grid, TextField } from "@mui/material";
import type { CreateClassFormData } from "./types";

interface BasicInfoSectionProps {
  formData: CreateClassFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors: Record<string, string>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
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
        Basic Information
      </Typography>
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Class Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
            required
            placeholder="e.g., Morning Yoga, Advanced Pilates"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
            placeholder="Describe what makes this class special..."
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BasicInfoSection;
