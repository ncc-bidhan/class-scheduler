import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import type { Occurrence } from "../types";

interface ClassListViewProps {
  occurrences: Occurrence[];
}

const ClassListView: React.FC<ClassListViewProps> = ({ occurrences }) => {
  const navigate = useNavigate();
  if (occurrences.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No classes scheduled for this period.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ borderRadius: 3, overflow: "hidden" }}
    >
      <Table>
        <TableHead sx={{ bgcolor: "action.hover" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Class Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Instructor</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Room</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {occurrences.map((occ, index) => {
            const start = DateTime.fromISO(occ.startAt);
            const end = DateTime.fromISO(occ.endAt);

            return (
              <TableRow
                key={`${occ.classId}-${index}`}
                hover
                onClick={() => navigate(`/classes/${occ.classId}`)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {occ.className || `Class ${occ.classId.slice(-4)}`}
                  </Typography>
                </TableCell>
                <TableCell>{start.toLocaleString(DateTime.DATE_MED)}</TableCell>
                <TableCell>
                  {start.toFormat("HH:mm")} - {end.toFormat("HH:mm")}
                </TableCell>
                <TableCell>
                  {occ.instructorName ? (
                    <Chip
                      label={occ.instructorName}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{occ.roomName || "-"}</TableCell>
                <TableCell>{occ.branchName || "-"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClassListView;
