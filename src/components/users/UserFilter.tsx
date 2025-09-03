import { Box, TextField, MenuItem } from "@mui/material";

export default function UserFilter({
  filters,
  onChange,
}: {
  filters: { username: string; status: string };
  onChange: (f: { username: string; status: string }) => void;
}) {
  return (
    <Box display="flex" gap={2} mb={2}>
      <TextField
        label="Buscar por nombre"
        value={filters.username}
        onChange={(e) => onChange({ ...filters, username: e.target.value })}
      />

      <TextField
        select
        label="Estado"
        value={filters.status === "ALL" ? "" : filters.status}
        onChange={(e) =>
          onChange({
            ...filters,
            status: e.target.value === "" ? "ALL" : e.target.value,
          })
        }
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="ALL">Todos</MenuItem>
        <MenuItem value="active">Activo</MenuItem>
        <MenuItem value="inactive">Inactivo</MenuItem>
      </TextField>
    </Box>
  );
}
