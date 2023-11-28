import { createSlice } from '@reduxjs/toolkit';
import { Authentication } from '../../app/types/auth';

interface AuthState {
   isLogin: boolean;
   user: Authentication | null;
}
export const initialState : AuthState = {
   isLogin: false,
   user: null
};

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      setLogin(state, action) {
         state.isLogin = action.payload
      },
      init(state) {
         let user = localStorage.getItem('user')
         if(user){
            state.user = JSON.parse(user)
            state.isLogin = true
         }else{
            window.location.href = '/auth/logout'
         }
      },
      setUser(state, action) {
         state.user = action?.payload;
         localStorage.setItem('user', JSON.stringify(action?.payload));
         localStorage.setItem('token',action?.payload?.accessToken);
      },
      logout(state) {
         state.isLogin = false;
         state.user = null;
         localStorage.removeItem('user');
         localStorage.removeItem('token');
         // window.location.reload();
      }
   },
});

export const { init,setLogin,setUser,logout } = authSlice.actions;

export const selectIsLogin = (state:any) => state.auth.isLogin;
export const selectUser = (state:any) => state.auth.user;
export const selectToken = (state:any) => state.auth.user?.accessToken;
export const selectOrganizationId = (state:any) => state.auth.user?.faskesOrganizationId;

export default authSlice.reducer;