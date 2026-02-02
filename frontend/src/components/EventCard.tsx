import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import type { Occurrence } from "../types";

interface EventCardProps {
  occurrence: Occurrence;
  isCompact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ occurrence, isCompact }) => {
  const navigate = useNavigate();
  const start = DateTime.fromISO(occurrence.startAt);
  const end = DateTime.fromISO(occurrence.endAt);

  const timeString = `${start.toFormat("HH:mm")} - ${end.toFormat("HH:mm")}`;

  return (
    <Card
      elevation={0}
      onClick={() => navigate(`/classes/${occurrence.classId}`)}
      sx={{
        minWidth: 0,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(10, 25, 41, 0.7)"
            : "rgba(25, 118, 210, 0.08)",
        color: (theme) =>
          theme.palette.mode === "dark" ? "primary.light" : "primary.main",
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "primary.main" : "primary.light",
        borderRadius: 1.5,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        backdropFilter: "blur(4px)",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}20`,
          borderColor: "primary.main",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(10, 25, 41, 0.9)"
              : "rgba(25, 118, 210, 0.12)",
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
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "inherit",
          }}
        >
          {occurrence.className || `Class: ${occurrence.classId.slice(-4)}`}
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
