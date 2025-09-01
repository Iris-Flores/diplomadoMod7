import { DataGrid, type GridColDef, type GridPaginationModel, type GridSortModel } from '@mui/x-data-grid';
import { Chip, IconButton, Stack, Tooltip } from '@mui/material';
import { Delete, Edit, ToggleOn, ToggleOff } from '@mui/icons-material';
import type { UserType } from './types';

interface Props {
  rows: UserType[];
  rowCount: number;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onSortModelChange: (model: GridSortModel) => void;
  onEdit: (user: UserType) => void;
  onToggle: (user: UserType) => void;
  onDelete: (id: number) => void;
}

export const UserTable = ({
  rows, rowCount, paginationModel, sortModel,
  onPaginationModelChange, onSortModelChange, onEdit, onToggle, onDelete
}: Props) => {
  const columns: GridColDef[] = [
    { field: 'username', headerName: 'Usuario', flex: 1 },
    { field: 'active', headerName: 'Estado', width: 140, renderCell: (p) => (
      <Chip label={p.row.active ? 'Activo' : 'Inactivo'} color={p.row.active ? 'success' : 'default'} />
    )},
    {
      field: 'actions', headerName: 'Acciones', width: 180, sortable: false, filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar"><IconButton size="small" onClick={() => onEdit(params.row)}><Edit /></IconButton></Tooltip>
          <Tooltip title={params.row.active ? 'Inactivar' : 'Activar'}>
            <IconButton size="small" onClick={() => onToggle(params.row)}>
              {params.row.active ? <ToggleOff /> : <ToggleOn />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar"><IconButton size="small" onClick={() => onDelete(params.row.id)}><Delete /></IconButton></Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      disableRowSelectionOnClick
      rowCount={rowCount}
      paginationMode="server"
      sortingMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      pageSizeOptions={[5,10,20]}
    />
  );
};
