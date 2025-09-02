import { Box, TextField, MenuItem } from '@mui/material';
import type { UserFilterStatusType } from './types';

interface Props {
  filterStatus: UserFilterStatusType;
  setFilterStatus: (value: UserFilterStatusType) => void;
  setSearch: (value: string) => void;
}

export const UserFilter = ({
  filterStatus,
  setFilterStatus,
  setSearch,
}: Props) => {
  return (
    <Box
      display="flex"
      gap={2}
      mb={2}
      flexWrap="wrap"
      justifyContent="space-between"
    >
      <TextField
        label="Buscar por nombre"
        variant="outlined"
        onChange={(e) => setSearch(e.target.value)}
      />

      <TextField
        label="Estado"
        select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as UserFilterStatusType)}
      >
        <MenuItem value="all">Todos</MenuItem>
        <MenuItem value="active">Activo</MenuItem>
        <MenuItem value="inactive">Inactivo</MenuItem>
      </TextField>
    </Box>
  );
};
