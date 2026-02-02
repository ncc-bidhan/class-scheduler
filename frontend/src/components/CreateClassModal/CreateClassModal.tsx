import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  Typography,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CalendarMonthOutlined as CalendarMonth,
  CloseOutlined as Close,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTime } from "luxon";
import { useSnackbar } from "notistack";
import {
  useCreateSingleClassMutation,
  useCreateRecurringClassMutation,
} from "../../services/classesApi";
import { useLazyGetBranchesQuery } from "../../services/branchApi";
import { useLazyGetInstructorsQuery } from "../../services/instructorApi";
import { useLazyGetRoomsQuery } from "../../services/roomApi";
import type { ErrorResponse, FieldError } from "../../types";
import ClassTypeSelector from "./ClassTypeSelector";
import BasicInfoSection from "./BasicInfoSection";
import LocationStaffSection from "./LocationStaffSection";
import ScheduleSection from "./ScheduleSection";
import ClassSettingsSection from "./ClassSettingsSection";
import type { CreateClassFormData } from "./types";

interface CreateClassModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();
  const [type, setType] = useState<"single" | "recurring">("single");
  const [formData, setFormData] = useState<CreateClassFormData>({
    name: "",
    description: "",
    branchId: "",
    instructorId: "",
    roomId: "",
    durationMinutes: 60,
    capacity: 20,
    waitlistCapacity: 5,
    allowDropIn: true,
    startAt: DateTime.now().plus({ hours: 1 }).startOf("hour"),
    endAt: DateTime.now().plus({ hours: 2 }).startOf("hour"),
    dtstart: DateTime.now().plus({ hours: 1 }).startOf("hour"),
    until: null as DateTime | null,
    recurrence: {
      freq: "weekly",
      interval: 1,
      byWeekday: [DateTime.now().weekday % 7],
      timeSlots: [{ startTime: "09:00", endTime: "10:00" }],
      timeSlotsByWeekday: {},
    },
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [createSingle, { isLoading: isSingleLoading }] =
    useCreateSingleClassMutation();
  const [createRecurring, { isLoading: isRecurringLoading }] =
    useCreateRecurringClassMutation();

  const [
    triggerGetBranches,
    {
      data: branchesResponse,
      isLoading: isBranchesLoading,
      isFetching: isBranchesFetching,
    },
  ] = useLazyGetBranchesQuery();
  const [
    triggerGetInstructors,
    {
      data: instructorsResponse,
      isLoading: isInstructorsLoading,
      isFetching: isInstructorsFetching,
    },
  ] = useLazyGetInstructorsQuery();
  const [
    triggerGetRooms,
    {
      data: roomsResponse,
      isLoading: isRoomsLoading,
      isFetching: isRoomsFetching,
    },
  ] = useLazyGetRoomsQuery();

  const isLoading = isSingleLoading || isRecurringLoading;

  const branches = useMemo(
    () => branchesResponse?.data || [],
    [branchesResponse],
  );
  const instructors = useMemo(
    () => instructorsResponse?.data || [],
    [instructorsResponse],
  );
  const rooms = useMemo(() => roomsResponse?.data || [], [roomsResponse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async () => {
    setFieldErrors({});
    setGeneralError(null);

    try {
      const payload: any = {
        ...formData,
        type,
        durationMinutes: Number(formData.durationMinutes),
        capacity: Number(formData.capacity),
        waitlistCapacity: Number(formData.waitlistCapacity),
      };

      if (type === "single") {
        payload.startAt = formData.startAt.toUTC().toISO();
        payload.endAt = formData.endAt.toUTC().toISO();
        delete payload.dtstart;
        delete payload.until;
        delete payload.recurrence;
        await createSingle(payload).unwrap();
      } else {
        payload.dtstart = formData.dtstart.toUTC().toISO();
        payload.until = formData.until ? formData.until.toUTC().toISO() : null;
        payload.recurrence = formData.recurrence;
        delete payload.startAt;
        delete payload.endAt;
        await createRecurring(payload).unwrap();
      }

      enqueueSnackbar(
        `${type === "single" ? "Single class" : "Recurring pattern"} created successfully`,
        { variant: "success" },
      );
      onClose();
    } catch (err: any) {
      const errorData = err.data as ErrorResponse;

      if (errorData?.errors) {
        const errors: Record<string, string> = {};
        errorData.errors.forEach((fe: FieldError) => {
          errors[fe.field] = fe.message;
        });
        setFieldErrors(errors);

        if (errors.instructorId || errors.roomId || errors.timeSlots) {
          enqueueSnackbar(errorData.message || "Schedule conflict detected", {
            variant: "error",
          });
        }
      } else {
        setGeneralError(errorData?.message || "An unexpected error occurred");
        enqueueSnackbar(errorData?.message || "Failed to create class", {
          variant: "error",
        });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          boxShadow: (theme) => theme.shadows[10],
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          pt: 3,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              width: 40,
              height: 40,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <CalendarMonth />
          </Box>
          <Box>
            <Typography
              variant="h5"
              fontWeight="800"
              sx={{ letterSpacing: "-0.02em" }}
            >
              Create New Class
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Set up a new single or recurring class
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "text.secondary",
            bgcolor: "action.hover",
            "&:hover": { bgcolor: "error.light", color: "error.main" },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={4}>
            {generalError && (
              <Alert
                severity="error"
                onClose={() => setGeneralError(null)}
                sx={{
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: "error.light",
                }}
              >
                {generalError}
              </Alert>
            )}

            <ClassTypeSelector type={type} onTypeChange={setType} />

            <BasicInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
              fieldErrors={fieldErrors}
            />

            <LocationStaffSection
              formData={formData}
              handleInputChange={handleInputChange}
              fieldErrors={fieldErrors}
              branches={branches}
              instructors={instructors}
              rooms={rooms}
              onBranchOpen={() => triggerGetBranches()}
              onInstructorOpen={() =>
                triggerGetInstructors({ branchId: formData.branchId })
              }
              onRoomOpen={() =>
                triggerGetRooms({ branchId: formData.branchId })
              }
              isBranchesLoading={isBranchesLoading || isBranchesFetching}
              isInstructorsLoading={
                isInstructorsLoading || isInstructorsFetching
              }
              isRoomsLoading={isRoomsLoading || isRoomsFetching}
            />

            <ScheduleSection
              type={type}
              formData={formData}
              setFormData={setFormData}
              fieldErrors={fieldErrors}
            />

            <ClassSettingsSection
              formData={formData}
              handleInputChange={handleInputChange}
              fieldErrors={fieldErrors}
            />
          </Stack>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.02)"
              : "grey.50",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          onClick={onClose}
          color="inherit"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            borderRadius: 1.5,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            px: 4,
            borderRadius: 1.5,
            boxShadow: (theme) => `0 8px 16px ${theme.palette.primary.main}40`,
            "&:hover": {
              boxShadow: (theme) =>
                `0 12px 20px ${theme.palette.primary.main}60`,
            },
          }}
        >
          {isLoading ? "Creating..." : "Create Class"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateClassModal;
