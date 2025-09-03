import { Box, Button, Typography } from "@mui/material";

export default function UserHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5"> Gestión de Usuarios</Typography>
      <Button variant="contained" onClick={onAdd}>Nuevo Usuario</Button>
    </Box>
  );
}
