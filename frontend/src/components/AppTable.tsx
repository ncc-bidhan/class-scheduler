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
  CircularProgress,
  Box,
  TablePagination,
} from "@mui/material";

export interface Column<T> {
  id: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
  width?: string | number;
}

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newLimit: number) => void;
}

interface AppTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  rowKey?: keyof T | ((row: T) => string | number);
  pagination?: PaginationProps;
}

const AppTable = <T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  isLoading,
  emptyMessage = "No data found.",
  rowKey = "_id" as keyof T,
  pagination,
}: AppTableProps<T>) => {
  const getRowKey = (row: T, index: number) => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    return (row[rowKey] as string | number) || index;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        width: "100%",
        display: "block",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(0,0,0,0.03)",
        "& .MuiTable-root": {
          minWidth: { xs: 650, md: "100%" },
        },
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "action.hover" }}>
            {columns.map((column) => (
              <TableCell
                key={column.id as string}
                align={column.align}
                sx={{
                  width: column.width,
                  fontWeight: "800",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  color: "text.secondary",
                  py: 2.5,
                  borderBottom: "2px solid",
                  borderColor: "divider",
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow
                key={getRowKey(row, index)}
                hover={!!onRowClick}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.02) !important"
                        : "rgba(148,58,208,0.02) !important",
                  },
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id as string}
                    align={column.align}
                    sx={{
                      py: 2,
                      fontSize: "0.9rem",
                      borderColor: "rgba(0,0,0,0.05)",
                    }}
                  >
                    {column.render
                      ? column.render(row)
                      : (row[column.id as keyof T] as React.ReactNode) || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Box sx={{ py: 6, opacity: 0.5 }}>
                  <Typography variant="body1" fontWeight="600">
                    {emptyMessage}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1} 
          onPageChange={(_, newPage) => pagination.onPageChange(newPage + 1)}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={(e) =>
            pagination.onRowsPerPageChange(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </TableContainer>
  );
};

export default AppTable;
