import React from "react";
import { Typography, Chip, IconButton, Stack } from "@mui/material";
import { InfoOutlined as IconInfo } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import type { Occurrence } from "../types";
import AppTable from "./AppTable";
import type { Column } from "./AppTable";

interface ClassListViewProps {
  occurrences: Occurrence[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (newLimit: number) => void;
  };
}

const ClassListView: React.FC<ClassListViewProps> = ({
  occurrences,
  pagination,
}) => {
  const navigate = useNavigate();

  const columns: Column<Occurrence>[] = [
    {
      id: "className",
      label: "Class Name",
      render: (occ) => (
        <Typography variant="body2" fontWeight="medium">
          {occ.className || `Class ${occ.classId.slice(-4)}`}
        </Typography>
      ),
    },
    {
      id: "date",
      label: "Date",
      render: (occ) =>
        DateTime.fromISO(occ.startAt).toLocaleString(DateTime.DATE_MED),
    },
    {
      id: "time",
      label: "Time",
      render: (occ) => {
        const start = DateTime.fromISO(occ.startAt);
        const end = DateTime.fromISO(occ.endAt);
        return `${start.toFormat("HH:mm")} - ${end.toFormat("HH:mm")}`;
      },
    },
    {
      id: "instructorName",
      label: "Instructor",
      render: (occ) =>
        occ.instructorName ? (
          <Chip label={occ.instructorName} size="small" variant="outlined" />
        ) : (
          "-"
        ),
    },
    { id: "roomName", label: "Room" },
    { id: "branchName", label: "Branch" },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      render: (occ) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton
            color="info"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/classes/${occ.classId}`);
            }}
          >
            <IconInfo fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <AppTable
      columns={columns}
      data={occurrences}
      emptyMessage="No classes scheduled for this period."
      rowKey={(occ) => `${occ.classId}-${occ.startAt}`}
      pagination={pagination}
    />
  );
};

export default ClassListView;
