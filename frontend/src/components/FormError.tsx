import React from "react";
import { Alert, Typography, Box } from "@mui/material";
import type { FieldError } from "../types";

interface FormErrorProps {
  errors?: FieldError[];
  field?: string;
  generalMessage?: string | null;
}

/**
 * Reusable component to display backend validation errors.
 * If 'field' is provided, it shows only the error for that specific field.
 * Otherwise, it displays general errors in an Alert.
 */
const FormError: React.FC<FormErrorProps> = ({ errors, field, generalMessage }) => {
  if (field) {
    const fieldError = errors?.find((e) => e.field === field);
    if (!fieldError) return null;
    return (
      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
        {fieldError.message}
      </Typography>
    );
  }

  const hasGeneralError = generalMessage || (errors && errors.length > 0 && !errors.some(e => e.field));
  
  if (!hasGeneralError && (!errors || errors.length === 0)) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error">
        {generalMessage || "Please fix the following errors:"}
        {errors && errors.length > 0 && (
          <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
            {errors
              .filter((e) => !e.field) // Show only non-field errors in the global alert
              .map((e, idx) => (
                <li key={idx}>
                  <Typography variant="body2">{e.message}</Typography>
                </li>
              ))}
          </Box>
        )}
      </Alert>
    </Box>
  );
};

export default FormError;
