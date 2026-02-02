import React, { useState } from "react";
import {
  Typography,
  Button,
  IconButton,
  Modal,
  TextField,
  Stack,
  Box,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined as IconEdit,
  DeleteOutlined as IconTrash,
  AddOutlined as IconPlus,
  InfoOutlined as IconInfo,
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

export function BranchesPage() {
  usePageTitle("Branches");
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
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
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
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
    {
      id: "actions",
      label: "Actions",
      align: "right",
      render: (branch) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton
            color="info"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/branches/${branch._id}`);
            }}
          >
            <IconInfo fontSize="small" />
          </IconButton>
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
            Branches
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your physical locations and branches
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
          Add New Branch
        </Button>
      </Box>

      <AppTable<Branch>
        columns={columns}
        data={branchesResponse?.data || []}
        isLoading={isLoading}
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

      <Modal
        open={opened}
        onClose={() => setOpened(false)}
        closeAfterTransition
      >
        <Box sx={modalStyle}>
          <Typography variant="h5" fontWeight="800" mb={1}>
            {editingBranch ? "Edit Branch" : "Add New Branch"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            {editingBranch
              ? "Update the details of your branch"
              : "Fill in the information to create a new branch location"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Branch Name"
                name="name"
                fullWidth
                required
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label="Address"
                name="address"
                fullWidth
                variant="outlined"
                value={formData.address}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    fullWidth
                    variant="outlined"
                    value={formData.phone}
                    onChange={handleInputChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    name="email"
                    fullWidth
                    variant="outlined"
                    value={formData.email}
                    onChange={handleInputChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>

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
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  {editingBranch ? "Save Changes" : "Create Branch"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
