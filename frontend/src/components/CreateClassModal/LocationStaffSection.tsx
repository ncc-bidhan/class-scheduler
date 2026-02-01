import React from "react";
import { Paper, Typography, Grid, TextField, MenuItem } from "@mui/material";
import { Room, Person } from "@mui/icons-material";
import type { CreateClassFormData } from "./types";
import type { Branch, Instructor, Room as RoomType } from "../../types";

interface LocationStaffSectionProps {
  formData: CreateClassFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors: Record<string, string>;
  branches: Branch[];
  instructors: Instructor[];
  rooms: RoomType[];
}

const LocationStaffSection: React.FC<LocationStaffSectionProps> = ({
  formData,
  handleInputChange,
  fieldErrors,
  branches,
  instructors,
  rooms,
}) => {
  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        gutterBottom
        color="primary"
      >
        Location & Staff
      </Typography>
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            select
            label="Branch"
            name="branchId"
            value={formData.branchId}
            onChange={handleInputChange}
            error={!!fieldErrors.branchId}
            helperText={fieldErrors.branchId || "Select branch first"}
            required
            InputProps={{
              startAdornment: <Room sx={{ mr: 1, color: "action.active" }} />,
            }}
          >
            {branches.map((branch) => (
              <MenuItem key={branch._id} value={branch._id}>
                {branch.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            select
            label="Instructor"
            name="instructorId"
            value={formData.instructorId}
            onChange={handleInputChange}
            error={!!fieldErrors.instructorId}
            helperText={fieldErrors.instructorId}
            required
            disabled={!formData.branchId}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: "action.active" }} />,
            }}
          >
            {instructors.map((instructor) => (
              <MenuItem key={instructor._id} value={instructor._id}>
                {instructor.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            select
            label="Room"
            name="roomId"
            value={formData.roomId}
            onChange={handleInputChange}
            error={!!fieldErrors.roomId}
            helperText={fieldErrors.roomId}
            required
            disabled={!formData.branchId}
            InputProps={{
              startAdornment: <Room sx={{ mr: 1, color: "action.active" }} />,
            }}
          >
            {rooms.map((room) => (
              <MenuItem key={room._id} value={room._id}>
                {room.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LocationStaffSection;
