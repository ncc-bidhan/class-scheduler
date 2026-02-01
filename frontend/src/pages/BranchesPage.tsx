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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined as IconEdit,
  DeleteOutlined as IconTrash,
  AddOutlined as IconPlus,
} from "@mui/icons-material";
import {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} from "../services/branchApi";
import type { Branch } from "../types";
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

export function BranchesPage() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    timezone: "UTC",
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: branchesResponse, isLoading } = useGetBranchesQuery({
    page,
    limit,
  });
  const [createBranch] = useCreateBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();
  const [deleteBranch] = useDeleteBranchMutation();

  const handleOpenModal = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        address: branch.address || "",
        phone: branch.phone || "",
        email: branch.email || "",
        timezone: branch.timezone,
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        timezone: "UTC",
      });
    }
    setOpened(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await updateBranch({ id: editingBranch._id, body: formData }).unwrap();
      } else {
        await createBranch(formData).unwrap();
      }
      setOpened(false);
    } catch (error) {
      console.error("Failed to save branch:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await deleteBranch(id).unwrap();
      } catch (error) {
        console.error("Failed to delete branch:", error);
      }
    }
  };

  const columns: Column<Branch>[] = [
    { id: "name", label: "Name" },
    { id: "address", label: "Address" },
    { id: "phone", label: "Phone" },
    { id: "timezone", label: "Timezone" },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      render: (branch) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(branch);
            }}
          >
            <IconEdit fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(branch._id);
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
          Manage Branches
        </Typography>
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={() => handleOpenModal()}
          fullWidth={false}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Add Branch
        </Button>
      </Box>

      <AppTable<Branch>
        columns={columns}
        data={branchesResponse?.data || []}
        isLoading={isLoading}
        onRowClick={(branch) => navigate(`/branches/${branch._id}`)}
        emptyMessage="No branches found. Add your first branch!"
        pagination={
          branchesResponse?.pagination
            ? {
                ...branchesResponse.pagination,
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
            {editingBranch ? "Edit Branch" : "Add Branch"}
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
                label="Address"
                name="address"
                fullWidth
                value={formData.address}
                onChange={handleInputChange}
              />
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange}
              />
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
              />
              <TextField
                label="Timezone"
                name="timezone"
                fullWidth
                required
                value={formData.timezone}
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
                  {editingBranch ? "Update" : "Create"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}
