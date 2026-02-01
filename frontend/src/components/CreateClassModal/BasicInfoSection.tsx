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
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        gutterBottom
        color="primary"
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
