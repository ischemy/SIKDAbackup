import { createSlice } from '@reduxjs/toolkit';

interface MessageState {
    message: string;
    type?: string;
    detailMessage?: string;
    lifeTime?: number
}
interface Action {
    type: string;
    payload: MessageState
}

const initialState: MessageState = {
    message: '',
    detailMessage: '',
    type: '',
    lifeTime: 3000 // 3 second
};

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessage(state, action:Action) {
            state.message = action.payload.message;
            state.type = action.payload.type || "success";
            state.detailMessage = action.payload.detailMessage;
        },
        setError(state, action:Action) {
            state.message = action.payload.message;
            state.type = action.payload.type || "error";
            state.detailMessage = action.payload.detailMessage;
        },
        clearMessage(state) {
            state.message = '';
            state.type = '';
            state.detailMessage = '';
            state.lifeTime = 3000
        }
    },
})

export const { setMessage,setError,clearMessage } = messageSlice.actions;

export const selectMessage = (state:any) => state.message;

export default messageSlice.reducer