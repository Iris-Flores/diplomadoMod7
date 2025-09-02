import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  handleOpenCreateDialog: () => void;
}

export const UserHeader = ({ handleOpenCreateDialog }: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h5">Gestión de Usuarios</Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenCreateDialog}
      >
        Crear Usuario
      </Button>
    </Box>
  );
};
