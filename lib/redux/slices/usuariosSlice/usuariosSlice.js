import { createSlice } from "@reduxjs/toolkit";

export const usuariosSlice = createSlice({
  name: "usuariosSlice",
  initialState: {
    allUsers: [],
    singleUser: {},
    ultimoUsuarioCreado: {},
  },
  reducers: {
    setUsuarios: (state, { payload }) => {
      state.todosUsuarios = payload;
    },
    setUsuarioPorId: (state, { payload }) => {
      state.usuarioIndividual = payload;
    },
    setUltimoUsuarioCreado: (state, { payload }) => {
      state.ultimoUsuarioCreado = payload;
    },
    setResetearEstadoUsuarios: (state) => {
      state.todosUsuarios = null;
      state.usuarioIndividual = null;
      state.ultimoUsuarioCreado = null;
    }
  }
});

export const {
  setUsuarios,
  setUsuarioPorId,
  setUltimoUsuarioCreado,
  setResetearEstadoUsuarios
} = usuariosSlice.actions;
