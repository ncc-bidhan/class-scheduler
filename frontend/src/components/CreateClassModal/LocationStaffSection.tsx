import React from "react";
import { Paper, Typography, Grid, TextField, MenuItem } from "@mui/material";
import { RoomOutlined as Room, PersonOutlined as Person } from "@mui/icons-material";
import type { CreateClassFormData } from "./types";
import type { Branch, Instructor, Room as RoomType } from "../../types";

interface LocationStaffSectionProps {
  formData: CreateClassFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors: Record<string, string>;
  branches: Branch[];
  instructors: Instructor[];
  rooms: RoomType[];
  onBranchOpen: () => void;
  onInstructorOpen: () => void;
  onRoomOpen: () => void;
  isBranchesLoading?: boolean;
  isInstructorsLoading?: boolean;
  isRoomsLoading?: boolean;
}

const LocationStaffSection: React.FC<LocationStaffSectionProps> = ({
  formData,
  handleInputChange,
  fieldErrors,
  branches,
  instructors,
  rooms,
  onBranchOpen,
  onInstructorOpen,
  onRoomOpen,
  isBranchesLoading,
  isInstructorsLoading,
  isRoomsLoading,
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
            SelectProps={{
              onOpen: onBranchOpen,
            }}
            InputProps={{
              startAdornment: <Room sx={{ mr: 1, color: "action.active" }} />,
            }}
          >
            {isBranchesLoading ? (
              <MenuItem disabled>Loading branches...</MenuItem>
            ) : branches.length > 0 ? (
              branches.map((branch) => (
                <MenuItem key={branch._id} value={branch._id}>
                  {branch.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No branches found</MenuItem>
            )}
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
            SelectProps={{
              onOpen: onInstructorOpen,
            }}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: "action.active" }} />,
            }}
          >
            {isInstructorsLoading ? (
              <MenuItem disabled>Loading instructors...</MenuItem>
            ) : instructors.length > 0 ? (
              instructors.map((instructor) => (
                <MenuItem key={instructor._id} value={instructor._id}>
                  {instructor.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>
                {formData.branchId
                  ? "No instructors found"
                  : "Select branch first"}
              </MenuItem>
            )}
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
            SelectProps={{
              onOpen: onRoomOpen,
            }}
            InputProps={{
              startAdornment: <Room sx={{ mr: 1, color: "action.active" }} />,
            }}
          >
            {isRoomsLoading ? (
              <MenuItem disabled>Loading rooms...</MenuItem>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <MenuItem key={room._id} value={room._id}>
                  {room.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>
                {formData.branchId ? "No rooms found" : "Select branch first"}
              </MenuItem>
            )}
          </TextField>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LocationStaffSection;
