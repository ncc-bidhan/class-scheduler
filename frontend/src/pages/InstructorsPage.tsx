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
  const [
    triggerGetBranches,
    { data: branchesResponse, isLoading: isBranchesLoading },
  ] = useLazyGetBranchesQuery();
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
            color="info"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/instructors/${instructor._id}`);
            }}
          >
            <IconInfo fontSize="small" />
          </IconButton>
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
            Instructors
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your teaching staff and their assignments
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
          Add New Instructor
        </Button>
      </Box>

      <AppTable<Instructor>
        columns={columns}
        data={instructorsResponse?.data || []}
        isLoading={isLoading}
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

      <Modal
        open={opened}
        onClose={() => setOpened(false)}
        closeAfterTransition
      >
        <Box sx={modalStyle}>
          <Typography variant="h5" fontWeight="800" mb={1}>
            {editingInstructor ? "Edit Instructor" : "Add New Instructor"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            {editingInstructor
              ? "Update the details of your staff member"
              : "Fill in the information to add a new instructor to your team"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                name="name"
                fullWidth
                required
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
              <TextField
                label="Bio"
                name="bio"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.bio}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  name="email"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  fullWidth
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleInputChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                />
              </Grid>

              <TextField
                select
                label="Assign Branches"
                name="branchIds"
                fullWidth
                SelectProps={{
                  multiple: true,
                  value: formData.branchIds,
                  onChange: handleBranchChange,
                  onOpen: () => {
                    if (!branchesResponse)
                      triggerGetBranches({ page: 1, limit: 100 });
                  },
                }}
                variant="outlined"
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
                  {editingInstructor ? "Save Changes" : "Create Instructor"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
