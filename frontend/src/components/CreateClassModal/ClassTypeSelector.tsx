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
    <Box display="flex" justifyContent="center">
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={handleTypeChange}
        color="primary"
        sx={{
          "& .MuiToggleButton-root": {
            px: 4,
            py: 1,
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 2,
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            },
          },
        }}
      >
        <ToggleButton value="single" sx={{ mr: 1 }}>
          <Schedule sx={{ mr: 1, fontSize: 20 }} />
          Single Class
        </ToggleButton>
        <ToggleButton value="recurring" sx={{ ml: 1 }}>
          <CalendarMonth sx={{ mr: 1, fontSize: 20 }} />
          Recurring Pattern
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ClassTypeSelector;
