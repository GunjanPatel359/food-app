import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from "./reducers/user"
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import storageSession from 'redux-persist/lib/storage/session'
// import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
  // storageSession,
};

const rootReducer = combineReducers({
  user:userReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore(persistedReducer);
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: [thunk]
// })
export const persistor = persistStore(store);