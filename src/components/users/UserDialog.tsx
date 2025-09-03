import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAlert } from "../../hooks"; 
import type { User } from "./types";

export default function UserDialog({
  open,
  user,
  onClose,
  handleCreateEdit,
}: {
  open: boolean;
  user: User | null;
  onClose: () => void;
  handleCreateEdit: (_: any, f: FormData) => Promise<any>;
}) {
  const { showAlert } = useAlert();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      
      setForm({ username: user.username, password: "", confirmPassword: "" });
    } else {
      
      setForm({ username: "", password: "", confirmPassword: "" });
    }
  }, [user]);

  const validateAndBuildFormData = (): FormData | null => {
    const fd = new FormData();

    const username = String(form.username ?? "").trim();
    const password = String(form.password ?? "");
    const confirmPassword = String(form.confirmPassword ?? "");

    if (!username) {
      showAlert("El nombre de usuario es obligatorio.", "warning");
      return null;
    }

    if (!user) {
      
      if (!password) {
        showAlert("La contraseña es obligatoria al crear un usuario.", "warning");
        return null;
      }
      if (password.length < 6) {
        showAlert("La contraseña debe tener al menos 6 caracteres.", "warning");
        return null;
      }
      if (password !== confirmPassword) {
        showAlert("Las contraseñas no coinciden.", "warning");
        return null;
      }
      fd.append("username", username);
      fd.append("password", password);
      fd.append("confirmPassword", confirmPassword);
    } else {
      
      fd.append("username", username);
      if (password) {
        if (password.length < 6) {
          showAlert("La contraseña debe tener al menos 6 caracteres.", "warning");
          return null;
        }
        if (password !== confirmPassword) {
          showAlert("Las contraseñas no coinciden.", "warning");
          return null;
        }
        fd.append("password", password);
        fd.append("confirmPassword", confirmPassword);
      }
    }

    return fd;
  };

  const handleSave = async () => {
    const fd = validateAndBuildFormData();
    if (!fd) return;
    await handleCreateEdit(undefined, fd);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{user ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre de usuario"
          fullWidth
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        {/* Creación: mostrar contraseña; edición: password opcional */}
        {!user && (
          <>
            <TextField
              margin="dense"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="dense"
              label="Confirmar contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </>
        )}

        {/* En edición dejamos la posibilidad de cambiar contraseña si el usuario escribe una */}
        {user && (
          <>
            <TextField
              margin="dense"
              label="Nueva contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="dense"
              label="Confirmar nueva contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

