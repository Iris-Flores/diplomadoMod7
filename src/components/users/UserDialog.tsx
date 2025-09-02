// src/components/users/UserDialog.tsx

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Box,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { UserFormValues, UserType, UserActionState } from './types';

interface Props {
  open: boolean;
  user: UserType | null;
  onClose: () => void;
  handleCreateEdit: (
    action: UserActionState | undefined,
    formData: FormData
  ) => Promise<void | { message: string; field?: keyof UserFormValues }>;
}

export const UserDialog = ({ open, user, onClose, handleCreateEdit }: Props) => {
  const isEdit = !!user;
  const [formValues, setFormValues] = useState<UserFormValues>({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<UserFormValues>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormValues({
        username: user.username,
        password: '',
        confirmPassword: '',
      });
    } else {
      setFormValues({
        username: '',
        password: '',
        confirmPassword: '',
      });
    }
    setErrors({});
  }, [user, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setErrors({});
    if (!isEdit && formValues.password !== formValues.confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      return;
    }

    const formData = new FormData();
    formData.append('username', formValues.username);
    formData.append('password', formValues.password);

    const result = await handleCreateEdit(isEdit ? 'edit' : 'create', formData);
    if (result?.field) {
      setErrors({ [result.field]: result.message });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
      <DialogContent>
        <Box mt={1} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nombre de usuario"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            fullWidth
          />

          <TextField
            label="Contraseña"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formValues.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {!isEdit && (
            <TextField
              label="Confirmar contraseña"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formValues.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEdit ? 'Guardar cambios' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
