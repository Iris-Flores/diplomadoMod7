import { Box } from '@mui/material';
import {
  UserDialog,
  UserFilter,
  UserHeader,
  UserTable,
} from '../../components/users';
import type { UserType, UserFormValues, UserActionState } from '../../components/users/types';
import { useEffect, useState } from 'react';
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useAlert, useAxios } from '../../hooks';
import { errorHelper, hanleZodError } from '../../helpers';
import { schemaUser } from '../../models';

export const UsersPage = () => {
  const { showAlert } = useAlert();
  const axios = useAxios();

  const [filterStatus, setFilterStatus] = useState<'all' | 'activo' | 'inactivo'>('all');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [total, setTotal] = useState(0);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 1,
    pageSize: 10,
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    listUsersApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterStatus, paginationModel, sortModel]);

  const listUsersApi = async () => {
    try {
      const orderBy = sortModel[0]?.field;
      const orderDir = sortModel[0]?.sort;

      const response = await axios.get('/users', {
        params: {
          page: paginationModel.page,
          limit: paginationModel.pageSize,
          orderBy,
          orderDir,
          search,
          status: filterStatus === 'all' ? undefined : filterStatus.toUpperCase(),
        },
      });

      setUsers(response.data.data);
      setTotal(response.data.total || response.data.count); 
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

  const handleOpenCreateDialog = () => {
    setUser(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (user: UserType) => {
    setUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setUser(null);
    setOpenDialog(false);
  };

  const handleCreateEdit = async (
    action: UserActionState | undefined,
    formdata: FormData
  ) => {
    const rawData = {
      username: formdata.get('username') as string,
      password: formdata.get('password') as string,
    };

    try {
      schemaUser.parse(rawData);

      if (action === 'edit' && user?.id) {
        await axios.put(`/users/${user.id}`, rawData);
        showAlert('Usuario editado', 'success');
      } else {
        await axios.post('/users', rawData);
        showAlert('Usuario creado', 'success');
      }

      listUsersApi();
      handleCloseDialog();
      return;
    } catch (error) {
      const err = hanleZodError<UserFormValues>(error, rawData);
      showAlert(err.message, 'error');
      return err;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const confirmed = window.confirm('¿Estás seguro de eliminar este usuario?');
      if (!confirmed) return;

      await axios.delete(`/users/${id}`);
      showAlert('Usuario eliminado', 'success');
      listUsersApi();
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

  const handleActivateInactivate = async (id: number, status: 'ACTIVE' | 'INACTIVE') => {
    try {
      const confirmed = window.confirm(
        `¿Estás seguro de ${status === 'ACTIVE' ? 'activar' : 'inactivar'} este usuario?`
      );
      if (!confirmed) return;

      await axios.patch(`/users/activateInactivate/${id}`, { status });
      showAlert(`Usuario ${status === 'ACTIVE' ? 'activado' : 'inactivado'}`, 'success');
      listUsersApi();
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <UserHeader handleOpenCreateDialog={handleOpenCreateDialog} />

      <UserFilter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setSearch={setSearch}
      />

      <UserTable
        users={users}
        rowCount={total}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
        handleDelete={handleDelete}
        handleActivateInactivate={handleActivateInactivate}
        handleOpenEditDialog={handleOpenEditDialog} handleToggleStatus={function (): void {
          throw new Error('Function not implemented.');
        } }      />

      <UserDialog
        open={openDialog}
        user={user}
        onClose={handleCloseDialog}
        handleCreateEdit={handleCreateEdit}
      />
    </Box>
  );
};
