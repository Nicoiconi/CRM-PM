import { createSlice } from "@reduxjs/toolkit"

export const usersSlice = createSlice({
  name: "usersSlice",
  initialState: {
    allUsers: [],
    singleUser: {},
    ultimoUsuarioCreado: {},
    loggedInUser: {},
  },
  reducers: {
    setUsuarios: (state, { payload }) => {
      state.todosUsuarios = payload
    },
    setUsuarioPorId: (state, { payload }) => {
      state.usuarioIndividual = payload
    },
    setUltimoUsuarioCreado: (state, { payload }) => {
      state.ultimoUsuarioCreado = payload
    },
    setLoggedInUser: (state, { payload }) => {
      state.loggedInUser = payload
    },
    setResetearEstadoUsuarios: (state) => {
      state.todosUsuarios = null
      state.usuarioIndividual = null
      state.loggedInUser = null
      state.ultimoUsuarioCreado = null
    }
  }
})

export const {
  setUsuarios,
  setUsuarioPorId,
  setUltimoUsuarioCreado,
  setLoggedInUser,
  setResetearEstadoUsuarios
} = usersSlice.actions
