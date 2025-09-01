import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useAlert, useAxios } from '../../hooks';
import { errorHelper } from '../../helpers';
import { UserDialog, type UserDialogValues, UserFilter, UserHeader, UserTable, type UserStatus, type UserType } from '../../components/users';

export const UsersPage = () => {
  const { showAlert } = useAlert();
  const axios = useAxios();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<UserStatus>('all');
  const [rows, setRows] = useState<UserType[]>([]);
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 1, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<UserType | null>(null);

  const list = async () => {
    try {
      const params: Record<string, unknown> = {
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        search,
      };
      if (status !== 'all') params.status = status;
      if (sortModel[0]) {
        params.sortField = sortModel[0].field;
        params.sortOrder = sortModel[0].sort;
      }
      const { data } = await axios.get('/users', { params });
      setRows(data.data ?? data.items ?? data.results ?? data);
      setTotal(data.total ?? data.count ?? data.totalCount ?? (data.data?.length ?? 0));
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

  useEffect(() => { list(); }, [search, status, paginationModel, sortModel]);

  const submit = async (form: UserDialogValues) => {
    try {
      if (editing) {
        await axios.put(`/users/${editing.id}`, form);
        showAlert('Usuario actualizado', 'success');
      } else {
        await axios.post('/users', form);
        showAlert('Usuario creado', 'success');
      }
      setDialogOpen(false); list();
    } catch (error) { showAlert(errorHelper(error), 'error'); }
  };

  const toggle = async (u: UserType) => {
    try { await axios.patch(`/users/${u.id}`, { active: !u.active }); list(); }
    catch (error) { showAlert(errorHelper(error), 'error'); }
  };

  const remove = async (id: number) => {
    try { await axios.delete(`/users/${id}`); list(); }
    catch (error) { showAlert(errorHelper(error), 'error'); }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <UserHeader onCreate={() => { setEditing(null); setDialogOpen(true); }} />
      <UserFilter search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} />
      <UserTable rows={rows} rowCount={total} paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel}
        onEdit={(u)=>{setEditing(u); setDialogOpen(true);}} onToggle={toggle} onDelete={remove} />
      <UserDialog open={dialogOpen} user={editing} onClose={() => setDialogOpen(false)} onSubmit={submit} />
    </Box>
  );
};
