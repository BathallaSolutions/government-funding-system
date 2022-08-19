import { configureStore } from '@reduxjs/toolkit';
import GlobalReducer from './GlobalReducer';

export default configureStore({
  reducer: {
    global: GlobalReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
