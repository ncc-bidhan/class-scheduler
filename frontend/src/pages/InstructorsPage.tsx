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
  useGetInstructorsQuery,
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
} from "../services/instructorApi";
import { useGetBranchesQuery } from "../services/branchApi";
import type { Instructor } from "../types";

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

  const { data: instructorsResponse, isLoading } = useGetInstructorsQuery();
  const { data: branchesResponse } = useGetBranchesQuery();
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
        branchIds: instructor.branchIds || [],
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

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );

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

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Bio</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Branches</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instructorsResponse?.data.map((instructor) => (
              <TableRow key={instructor._id} hover>
                <TableCell>{instructor.name}</TableCell>
                <TableCell>{instructor.bio || "-"}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {instructor.email || "-"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {instructor.phone || "-"}
                  </Typography>
                </TableCell>
                <TableCell>{instructor.branchIds.length} branches</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenModal(instructor)}
                    >
                      <IconEdit fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(instructor._id)}
                    >
                      <IconTrash fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {!instructorsResponse?.data.length && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2 }}
                  >
                    No instructors found. Add your first instructor!
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
                }}
                value={formData.branchIds}
                onChange={handleBranchChange}
              >
                {branchesResponse?.data.map((branch) => (
                  <MenuItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </MenuItem>
                ))}
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
