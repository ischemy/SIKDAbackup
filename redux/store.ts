import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter/counterSlice';
import authReducer from './auth/authSlice';
import messageSlice from './message/messageSlice';
import patientSlice from './patient/patientSlice';

const store =  configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    message: messageSlice,
    patient: patientSlice
  },
});

store.subscribe(() => {
  console.log(store.getState());
})

export default store;