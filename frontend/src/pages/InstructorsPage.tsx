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
  EditOutlined as IconEdit,
  DeleteOutlined as IconTrash,
  AddOutlined as IconPlus,
} from "@mui/icons-material";
import {
  useGetInstructorsQuery,
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
} from "../services/instructorApi";
import { useLazyGetBranchesQuery } from "../services/branchApi";
import type { Instructor, Branch } from "../types";
import AppTable from "../components/AppTable";
import type { Column } from "../components/AppTable";
import usePageTitle from "../hooks/usePageTitle";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 450 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  borderRadius: 2,
};

export function InstructorsPage() {
  usePageTitle("Instructors");
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
    phone: "",
    branchIds: [] as string[],
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: instructorsResponse, isLoading } = useGetInstructorsQuery({
    page,
    limit,
  });
  const [triggerGetBranches, { data: branchesResponse, isLoading: isBranchesLoading }] =
    useLazyGetBranchesQuery();
  const [createInstructor] = useCreateInstructorMutation();
  const [updateInstructor] = useUpdateInstructorMutation();
  const [deleteInstructor] = useDeleteInstructorMutation();

  const handleOpenModal = (instructor?: Instructor) => {
    if (instructor) {
      setEditingInstructor(instructor);
      setFormData({
        name: instructor.name,
        bio: instructor.bio || "",
        email: instructor.email || "",
        phone: instructor.phone || "",
        branchIds: (instructor.branchIds || []).map((b) =>
          typeof b === "string" ? b : b._id,
        ),
      });
    } else {
      setEditingInstructor(null);
      setFormData({
        name: "",
        bio: "",
        email: "",
        phone: "",
        branchIds: [],
      });
    }
    setOpened(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBranchChange = (e: any) => {
    setFormData({ ...formData, branchIds: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInstructor) {
        await updateInstructor({
          id: editingInstructor._id,
          body: formData,
        }).unwrap();
      } else {
        await createInstructor(formData).unwrap();
      }
      setOpened(false);
    } catch (error) {
      console.error("Failed to save instructor:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      try {
        await deleteInstructor(id).unwrap();
      } catch (error) {
        console.error("Failed to delete instructor:", error);
      }
    }
  };

  const columns: Column<Instructor>[] = [
    { id: "name", label: "Name" },
    { id: "bio", label: "Bio" },
    {
      id: "contact",
      label: "Contact",
      render: (instructor) => (
        <>
          <Typography variant="body2">{instructor.email || "-"}</Typography>
          <Typography variant="caption" color="text.secondary">
            {instructor.phone || "-"}
          </Typography>
        </>
      ),
    },
    {
      id: "branches",
      label: "Branches",
      render: (instructor) => `${instructor.branchIds.length} branches`,
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      render: (instructor) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(instructor);
            }}
          >
            <IconEdit fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(instructor._id);
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
          Manage Instructors
        </Typography>
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={() => handleOpenModal()}
          fullWidth={false}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Add Instructor
        </Button>
      </Box>

      <AppTable<Instructor>
        columns={columns}
        data={instructorsResponse?.data || []}
        isLoading={isLoading}
        onRowClick={(instructor) => navigate(`/instructors/${instructor._id}`)}
        emptyMessage="No instructors found. Add your first instructor!"
        pagination={
          instructorsResponse?.pagination
            ? {
                ...instructorsResponse.pagination,
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
            {editingInstructor ? "Edit Instructor" : "Add Instructor"}
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
                label="Bio"
                name="bio"
                fullWidth
                multiline
                rows={2}
                value={formData.bio}
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
                label="Phone"
                name="phone"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange}
              />
              <TextField
                select
                label="Branches"
                fullWidth
                SelectProps={{
                  multiple: true,
                  onOpen: () => triggerGetBranches(),
                }}
                value={formData.branchIds}
                onChange={handleBranchChange}
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
                  {editingInstructor ? "Update" : "Create"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}
