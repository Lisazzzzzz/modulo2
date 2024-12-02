import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Persistência no localStorage
import authReducer from "./authSlice";
import { movieApi } from "../services/movieApi";
import { authApi } from "../services/authApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Apenas o estado de autenticação será persistido
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      movieApi.middleware,
      authApi.middleware
    ),
});

const persistor = persistStore(store);

export { store, persistor };
