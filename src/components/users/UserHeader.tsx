import { Box, Button, Typography } from '@mui/material';

interface Props {
  onCreate: () => void;
}

export const UserHeader = ({ onCreate }: Props) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
    <Typography variant="h5">Usuarios</Typography>
    <Button variant="contained" onClick={onCreate}>
      Agregar usuario
    </Button>
  </Box>
);
