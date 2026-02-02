import React, { useState } from "react";
import {
  Typography,
  Button,
  IconButton,
  Modal,
  TextField,
  Stack,
  Box,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined as IconEdit,
  DeleteOutlined as IconTrash,
  AddOutlined as IconPlus,
  InfoOutlined as IconInfo,
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
import usePageTitle from "../hooks/usePageTitle";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 550 },
  bgcolor: "background.paper",
  boxShadow: (theme: any) =>
    theme.palette.mode === "dark"
      ? "0 24px 80px rgba(0,0,0,0.5)"
      : "0 24px 80px rgba(148, 58, 208, 0.12)",
  p: { xs: 4, sm: 6 },
  borderRadius: 4,
  border: "1px solid",
  borderColor: "divider",
  outline: "none",
};

export function RoomsPage() {
  usePageTitle("Rooms");
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
  const [
    triggerGetBranches,
    { data: branchesResponse, isLoading: isBranchesLoading },
  ] = useLazyGetBranchesQuery();
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
            color="info"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/rooms/${room._id}`);
            }}
          >
            <IconInfo fontSize="small" />
          </IconButton>
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
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 4,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.02)",
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "text.primary",
              letterSpacing: "-0.02em",
            }}
          >
            Rooms
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your physical locations and classroom capacities
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={() => handleOpenModal()}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 14px 0 rgba(0,0,0,0.39)"
                : "0 4px 14px 0 rgba(148, 58, 208, 0.39)",
          }}
        >
          Add New Room
        </Button>
      </Box>

      <AppTable<Room>
        columns={columns}
        data={roomsResponse?.data || []}
        isLoading={isLoading}
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

      <Modal
        open={opened}
        onClose={() => setOpened(false)}
        closeAfterTransition
      >
        <Box sx={modalStyle}>
          <Typography variant="h5" fontWeight="800" mb={1}>
            {editingRoom ? "Edit Room" : "Add New Room"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            {editingRoom
              ? "Update the details of your classroom"
              : "Fill in the information to add a new room to your facilities"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Room Name"
                name="name"
                fullWidth
                required
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
              <TextField
                select
                label="Assign to Branch"
                name="branchId"
                fullWidth
                required
                variant="outlined"
                SelectProps={{
                  onOpen: () => {
                    if (!branchesResponse)
                      triggerGetBranches({ page: 1, limit: 100 });
                  },
                }}
                value={formData.branchId}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              >
                {isBranchesLoading ? (
                  <MenuItem disabled>Loading branches...</MenuItem>
                ) : (
                  branchesResponse?.data.map((branch: Branch) => (
                    <MenuItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
              <TextField
                label="Seating Capacity"
                name="capacity"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.capacity}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  onClick={() => setOpened(false)}
                  color="inherit"
                  sx={{ textTransform: "none", fontWeight: "bold" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    px: 4,
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  {editingRoom ? "Save Changes" : "Create Room"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
