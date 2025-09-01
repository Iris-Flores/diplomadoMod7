import { useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, InputAdornment, TextField
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type { UserType } from './types';

export type UserDialogValues = {
  username: string;
  password?: string;
  confirmPassword?: string;
};

interface Props {
  open: boolean;
  user: UserType | null;
  onClose: () => void;
  onSubmit: (data: UserDialogValues) => Promise<void> | void;
  isPending?: boolean;
}

export const UserDialog = ({ open, user, onClose, onSubmit, isPending }: Props) => {
  const [form, setForm] = useState<UserDialogValues>({ username: '', password: '', confirmPassword: '' });
  const [show, setShow] = useState(false);
  const isEdit = Boolean(user);

  useEffect(() => {
    setForm({ username: user?.username ?? '', password: '', confirmPassword: '' });
  }, [user]);

  const handleSubmit = async () => {
    if (!form.username || (!isEdit && !form.password)) return;
    if ((form.password || form.confirmPassword) && form.password !== form.confirmPassword) return;
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{isEdit ? 'Editar usuario' : 'Nuevo usuario'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Usuario"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            fullWidth
          />
          <TextField
            label="Contraseña"
            type={show ? 'text' : 'password'}
            value={form.password ?? ''}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShow((s) => !s)} edge="end">
                    {show ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Confirmar contraseña"
            type={show ? 'text' : 'password'}
            value={form.confirmPassword ?? ''}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={!!isPending}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!!isPending}>
          {isPending ? <CircularProgress size={20} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
