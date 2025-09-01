import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import type { UserStatus } from './types';

interface Props {
  search: string;
  status: UserStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: UserStatus) => void;
}

export const UserFilter = ({ search, status, onSearchChange, onStatusChange }: Props) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    <TextField
      label="Buscar por nombre"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      fullWidth
    />
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel id="status-label">Estado</InputLabel>
      <Select
        labelId="status-label"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as UserStatus)}
      >
        <MenuItem value="all">Todos</MenuItem>
        <MenuItem value="active">Activos</MenuItem>
        <MenuItem value="inactive">Inactivos</MenuItem>
      </Select>
    </FormControl>
  </Box>
);
