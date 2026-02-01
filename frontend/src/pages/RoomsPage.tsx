import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  TextField,
  Stack,
  CircularProgress,
  Box,
  Divider,
  MenuItem,
} from "@mui/material";
import {
  Edit as IconEdit,
  Delete as IconTrash,
  Add as IconPlus,
} from "@mui/icons-material";
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from "../services/roomApi";
import { useGetBranchesQuery } from "../services/branchApi";
import type { Room } from "../types";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export function RoomsPage() {
  const [opened, setOpened] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    branchId: "",
    capacity: 20 as number | "",
  });

  const { data: roomsResponse, isLoading } = useGetRoomsQuery();
  const { data: branchesResponse } = useGetBranchesQuery();
  const [createRoom] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        name: room.name,
        branchId: room.branchId,
        capacity: room.capacity || "",
      });
    } else {
      setEditingRoom(null);
      setFormData({
        name: "",
        branchId: "",
        capacity: 20,
      });
    }
    setOpened(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "capacity" ? (value === "" ? "" : parseInt(value)) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        capacity: formData.capacity === "" ? undefined : formData.capacity,
      };
      if (editingRoom) {
        await updateRoom({ id: editingRoom._id, body: payload }).unwrap();
      } else {
        await createRoom(payload).unwrap();
      }
      setOpened(false);
    } catch (error) {
      console.error("Failed to save room:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(id).unwrap();
      } catch (error) {
        console.error("Failed to delete room:", error);
      }
    }
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Manage Rooms
        </Typography>
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={() => handleOpenModal()}
        >
          Add Room
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roomsResponse?.data.map((room) => {
              const branch = branchesResponse?.data.find(
                (b) => b._id === room.branchId,
              );
              return (
                <TableRow key={room._id} hover>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{branch?.name || room.branchId}</TableCell>
                  <TableCell>{room.capacity || "-"}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(room)}
                      >
                        <IconEdit fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(room._id)}
                      >
                        <IconTrash fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
            {!roomsResponse?.data.length && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2 }}
                  >
                    No rooms found. Add your first room!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={opened} onClose={() => setOpened(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" mb={3}>
            {editingRoom ? "Edit Room" : "Add Room"}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                required
                value={formData.name}
                onChange={handleInputChange}
              />
              <TextField
                select
                label="Branch"
                name="branchId"
                fullWidth
                required
                value={formData.branchId}
                onChange={handleInputChange}
              >
                {branchesResponse?.data.map((branch) => (
                  <MenuItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Capacity"
                name="capacity"
                type="number"
                fullWidth
                value={formData.capacity}
                onChange={handleInputChange}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button onClick={() => setOpened(false)} color="inherit">
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  {editingRoom ? "Update" : "Create"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}
