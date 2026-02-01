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
      variant="outlined"
      sx={{ borderRadius: 3, overflow: "hidden" }}
    >
      <Table>
        <TableHead sx={{ bgcolor: "action.hover" }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id as string}
                align={column.align}
                sx={{ fontWeight: "bold", width: column.width }}
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
                sx={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id as string} align={column.align}>
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
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1} // MUI uses 0-based indexing
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
