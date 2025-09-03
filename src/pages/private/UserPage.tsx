import { Box } from "@mui/material";
import {
  UserDialog,
  UserFilter,
  UserHeader,
  UserTable,
} from "../../components/users";
import { useEffect, useState } from "react";
import type { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useAlert, useAxios } from "../../hooks";
import { errorHelper } from "../../helpers";
//import { schemaUser, type UserFormValues } from "../../models/UserModel";
import type { User, PaginatedResponse, FilterStatus, UserStatus } from "../../components/users/types";
//import { z } from "zod";

export const UserPage = () => {
  const { showAlert } = useAlert();
  const axios = useAxios();

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 1,
    pageSize: 10,
  });
  const [sortModel] = useState<GridSortModel>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    listUserApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterStatus, paginationModel, sortModel]);

  const listUserApi = async () => {
    try {
      const orderBy = sortModel[0]?.field;
      const orderDir = sortModel[0]?.sort;
      const response = await axios.get<PaginatedResponse<User>>("/users", {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          orderBy,
          orderDir,
          search,
          status: filterStatus === "ALL" ? undefined : filterStatus,
        },
      });
      setUsers(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      showAlert(errorHelper(error), "error");
    }
  };

  const handleOpenCreateDialog = () => {
    setOpenDialog(true);
    setUser(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUser(null);
  };

  const handleOpenEditDialog = (u: User) => {
    setOpenDialog(true);
    setUser(u);
  };
  
 const handleCreateEdit = async (_: any, formdata: FormData) => {
  try {
    
    const username = String(formdata.get("username") ?? "").trim();
    const passwordRaw = formdata.get("password");
    const confirmRaw = formdata.get("confirmPassword");

    if (user?.id) {
      const payload: any = { username };

      if (passwordRaw !== null && String(passwordRaw).length > 0) {
        payload.password = String(passwordRaw);
        payload.confirmPassword = String(confirmRaw ?? "");
      }

      if (!username) {
        showAlert("El nombre de usuario es obligatorio.", "warning");
        return;
      }
      console.debug("PUT /users payload:", payload);

      const res = await axios.put(`/users/${user.id}`, payload);
      console.debug("PUT /users response:", res.data);
      showAlert("Usuario editado", "success");

    } else {
      const password = String(passwordRaw ?? "");
      const confirmPassword = String(confirmRaw ?? "");

      if (!username) {
        showAlert("El nombre de usuario es obligatorio.", "warning");
        return;
      }
      if (!password) {
        showAlert("La contraseña es obligatoria al crear usuario.", "warning");
        return;
      }
      if (password.length < 6) {
        showAlert("La contraseña debe tener al menos 6 caracteres.", "warning");
        return;
      }
      if (password !== confirmPassword) {
        showAlert("Las contraseñas no coinciden.", "warning");
        return;
      }

      const payloadCreate = {
        username,
        password,
        confirmPassword,
        status: "inactive" as UserStatus,
      };

      
      console.debug("POST /users payload:", payloadCreate);
      const res = await axios.post("/users", payloadCreate);
      console.debug("POST /users response:", res.data);
      showAlert("Usuario creado (inactivo)", "success");
    }
    await listUserApi();
    handleCloseDialog();
    return;
  } catch (err: any) {
    const serverMsg = err?.response?.data?.message ?? err?.response?.data ?? err?.message;
    console.error("handleCreateEdit error:", err, "serverMsg:", serverMsg);
    showAlert(serverMsg ? String(serverMsg) : errorHelper(err), "error");
  }
};


  const handleDelete = async (id: number) => {
    try {
      if (!window.confirm("¿Estas seguro de eliminar?")) return;
      await axios.delete(`/users/${id}`);
      showAlert("Usuario eliminado", "success");
      listUserApi();
    } catch (error) {
      showAlert(errorHelper(error), "error");
    }
  };

  const handleToggleStatus = async (id: number, status: UserStatus) => {
    try {
      if (!window.confirm("¿Cambiar estado del usuario?")) return;
      await axios.patch(`/users/${id}`, {
        status: status === "active" ? "inactive" : "active",
      });
      showAlert("Estado actualizado", "success");
      listUserApi();
    } catch (error) {
      showAlert(errorHelper(error), "error");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <UserHeader onAdd={handleOpenCreateDialog} />

      <UserFilter
        filters={{ username: search, status: filterStatus }}
        onChange={({ username, status }) => {
          setSearch(username);
          setFilterStatus(status as FilterStatus);
        }}
      />

      <UserTable
        users={users}
        paginationModel={paginationModel}
        rowCount={total}
        sortModel={sortModel}
        setPaginationModel={setPaginationModel}
        setSortModel={() => {}}
        handleOpenEditDialog={handleOpenEditDialog}
        handleDelete={handleDelete}
        handleToggleStatus={handleToggleStatus}
      />

      <UserDialog
        open={openDialog}
        user={user}
        onClose={handleCloseDialog}
        handleCreateEdit={handleCreateEdit}
      />
    </Box>
  );
};

