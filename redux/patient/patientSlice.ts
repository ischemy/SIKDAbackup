import { Patient } from '../../app/types/patient';
import { createSlice } from '@reduxjs/toolkit';

interface PatientState {
    nik: string|null
    patient: Patient|null
    type: string|null
}

export const initialState : PatientState = {
    nik: null,
    patient: null,
    type: null
}

const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        setPatient(state, action) {
            state.patient = action.payload
        },
        setEmptyPatient(state, action) {
            state.patient = null
        },
        setNIK(state, action) {
            state.nik = action.payload
        },
        setType(state, action) {
            state.type = action.payload
        }
    },
})

export const { setPatient,setEmptyPatient,setNIK,setType } = patientSlice.actions;

export const selectNIK = (state:any) => state.patient.nik;
export const selectPatient = (state:any) => state.patient.patient;
export const selectType = (state:any) => state.patient.type;

export default patientSlice.reducer