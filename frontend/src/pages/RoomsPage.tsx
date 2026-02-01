import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  IconButton,
  Modal,
  TextField,
  Stack,
  Box,
  Divider,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
import { useLazyGetBranchesQuery } from "../services/branchApi";
import type { Room, Branch } from "../types";
import AppTable from "../components/AppTable";
import type { Column } from "../components/AppTable";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  borderRadius: 2,
};

export function RoomsPage() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    branchId: "",
    capacity: 20 as number | "",
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: roomsResponse, isLoading } = useGetRoomsQuery({
    page,
    limit,
  });
  const [triggerGetBranches, { data: branchesResponse, isLoading: isBranchesLoading }] =
    useLazyGetBranchesQuery();
  const [createRoom] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        name: room.name,
        branchId:
          typeof room.branchId === "string" ? room.branchId : room.branchId._id,
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

  const columns: Column<Room>[] = [
    { id: "name", label: "Name" },
    {
      id: "branchId",
      label: "Branch",
      render: (room) => {
        if (typeof room.branchId === "object" && room.branchId !== null) {
          return room.branchId.name;
        }
        const branch = branchesResponse?.data.find(
          (b) => b._id === room.branchId,
        );
        return branch?.name || room.branchId;
      },
    },
    {
      id: "capacity",
      label: "Capacity",
      render: (room) => room.capacity || "-",
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      render: (room) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(room);
            }}
          >
            <IconEdit fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(room._id);
            }}
          >
            <IconTrash fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1.75rem", md: "2.125rem" } }}
        >
          Manage Rooms
        </Typography>
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={() => handleOpenModal()}
          fullWidth={false}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Add Room
        </Button>
      </Box>

      <AppTable<Room>
        columns={columns}
        data={roomsResponse?.data || []}
        isLoading={isLoading}
        onRowClick={(room) => navigate(`/rooms/${room._id}`)}
        emptyMessage="No rooms found. Add your first room!"
        pagination={
          roomsResponse?.pagination
            ? {
                ...roomsResponse.pagination,
                onPageChange: setPage,
                onRowsPerPageChange: (newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                },
              }
            : undefined
        }
      />

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
                SelectProps={{
                  onOpen: () => triggerGetBranches(),
                }}
                value={formData.branchId}
                onChange={handleInputChange}
                disabled={isBranchesLoading}
              >
                {isBranchesLoading ? (
                  <MenuItem disabled>Loading branches...</MenuItem>
                ) : branchesResponse?.data && branchesResponse.data.length > 0 ? (
                  branchesResponse.data.map((branch: Branch) => (
                    <MenuItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No branches found</MenuItem>
                )}
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
