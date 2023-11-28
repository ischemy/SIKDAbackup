'use client'
import Axios from "axios"
import { ErrorResponse } from "../types/response";

let axios = Axios.create({
    baseURL: 'https://suddenly-vocal-parrot.ngrok-free.app/api/v1',
    headers: {
      'ngrok-skip-browser-warning':true
    }
});

// Menambahkan interceptor untuk menangani error
axios.interceptors.response.use(
    response => response,
    error => {
      let message = ""
      // Tangani error di sini
      if (error.response) {
        // Respons diterima dengan kode status yang tidak dalam kisaran 2xx
        let result:ErrorResponse = error.response.data;
        message = "Error: "+ result.message;
      } else if (error.request) {
        // Tidak ada respons dari server
        message = "No response received: " + error.request
      } else {
        // Terjadi kesalahan selama pengiriman permintaan
        console.error("Request failed: ", error.message);
        message = "Request failed: " +error.message
      }
      if(error.response.status == 401){
        // redirect to logout page
        if(error?.config?.url != 'auth/login'){
          window.location.href = '/auth/login';
        }
      }
      return Promise.reject(error);
    }
)

export const InitRequest = async()=>{
  if(localStorage){
    const token = localStorage.getItem('token');
  
    if(token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }
}

export const Post = async(endpoint:string,data:any) => {
  InitRequest()
  return await axios.post(endpoint,data)  
}

export const Get = async(endpoint:string,params?:any) => {
  InitRequest()
  return await axios.get(endpoint,{params})
}

export const Put = async(endpoint:string,data:any) => {
  InitRequest()
  return await axios.put(endpoint,data)
}

export const Patch = async(endpoint:string,data:any) => {
  InitRequest()
  return await axios.patch(endpoint,data)
}

export const Delete = async(endpoint:string) => {
  InitRequest()
  return await axios.delete(endpoint)
}

