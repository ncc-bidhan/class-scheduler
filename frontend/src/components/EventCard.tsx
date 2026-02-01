import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { DateTime } from "luxon";
import type { Occurrence } from "../types";

interface EventCardProps {
  occurrence: Occurrence;
  isCompact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ occurrence, isCompact }) => {
  const start = DateTime.fromISO(occurrence.startAt);
  const end = DateTime.fromISO(occurrence.endAt);

  const timeString = `${start.toFormat("HH:mm")} - ${end.toFormat("HH:mm")}`;

  return (
    <Card
      elevation={0}
      sx={{
        minWidth: 0,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "primary.dark" : "primary.light",
        color: "primary.contrastText",
        border: "1px solid",
        borderColor: "primary.main",
        transition: "filter 0.2s",
        "&:hover": {
          filter: "brightness(1.1)",
        },
        cursor: "pointer",
      }}
    >
      <CardContent
        sx={{
          p: isCompact ? 1 : 1.5,
          "&:last-child": { pb: isCompact ? 1 : 1.5 },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            display: "block",
            truncate: true,
            color: "inherit",
          }}
        >
          Class: {occurrence.classId.slice(-4)}
        </Typography>
        {!isCompact && (
          <Typography
            variant="caption"
            sx={{ display: "block", opacity: 0.9, color: "inherit" }}
          >
            {timeString}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
