import React from "react";
import { Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { ScheduleOutlined as Schedule, CalendarMonthOutlined as CalendarMonth } from "@mui/icons-material";

interface ClassTypeSelectorProps {
  type: "single" | "recurring";
  onTypeChange: (type: "single" | "recurring") => void;
}

const ClassTypeSelector: React.FC<ClassTypeSelectorProps> = ({
  type,
  onTypeChange,
}) => {
  const handleTypeChange = (_: any, newType: "single" | "recurring") => {
    if (newType) onTypeChange(newType);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        p: 0.5,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.03)",
        borderRadius: 2.5,
        width: "fit-content",
        mx: "auto",
      }}
    >
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={handleTypeChange}
        color="primary"
        sx={{
          gap: 1,
          "& .MuiToggleButtonGroup-grouped": {
            border: 0,
            "&.Mui-disabled": {
              border: 0,
            },
            "&:not(:first-of-type)": {
              borderRadius: 2,
            },
            "&:first-of-type": {
              borderRadius: 2,
            },
          },
          "& .MuiToggleButton-root": {
            px: { xs: 2, sm: 4 },
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "text.secondary",
            transition: "all 0.2s ease",
            "&.Mui-selected": {
              bgcolor: "background.paper",
              color: "primary.main",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "background.paper",
              },
            },
          },
        }}
      >
        <ToggleButton value="single">
          <Schedule sx={{ mr: 1, fontSize: 20 }} />
          Single Class
        </ToggleButton>
        <ToggleButton value="recurring">
          <CalendarMonth sx={{ mr: 1, fontSize: 20 }} />
          Recurring Pattern
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ClassTypeSelector;
