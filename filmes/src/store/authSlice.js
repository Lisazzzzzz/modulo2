import { createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Components/firebase/firebase.conf";

// Slice para gerenciar o estado de autenticação
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // Dados do usuário autenticado
    isAuthenticated: false, // Estado de autenticação
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

// Função para inicializar o listener de autenticação do Firebase
export const initializeAuthListener = () => (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Atualiza o estado no Redux com as informações do usuário
      dispatch(setUser({ uid: user.uid, email: user.email }));
    } else {
      // Limpa o estado no Redux se não houver usuário autenticado
      dispatch(clearUser());
    }
  });
};

export default authSlice.reducer;