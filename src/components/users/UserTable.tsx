import {
  DataGrid,
  type GridPaginationModel,
  type GridSortModel,
  type GridColDef,
} from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import type { UserType } from './types';

interface Props {
  users: UserType[];
  rowCount: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  setSortModel: (model: GridSortModel) => void;
  handleDelete: (id: number) => void;
  handleToggleStatus: (id: number, currentStatus: boolean) => void;
   handleActivateInactivate: (id: number, status: 'ACTIVE' | 'INACTIVE') => void;
  handleOpenEditDialog: (user: UserType) => void;
}

export const UserTable = ({
  users,
  rowCount,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
  handleDelete,
  handleToggleStatus,
  handleOpenEditDialog,
}: Props) => {
  

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: 'Nombre de usuario', flex: 1 },
    { field: 'status', headerName: 'Estado', width: 130 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => handleOpenEditDialog(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleToggleStatus(row.id, row.status === 'active')}>
            {row.status === 'active' ? <ToggleOffIcon /> : <ToggleOnIcon />}
          </IconButton>
          <IconButton onClick={() => handleDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  

  return (
    <DataGrid
      autoHeight
      rows={users}
      columns={columns}
      paginationMode="server"
      sortingMode="server"
      rowCount={rowCount}
      pageSizeOptions={[10, 20, 50]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      sortModel={sortModel}
      onSortModelChange={setSortModel}
      disableRowSelectionOnClick
    />
  );
};
