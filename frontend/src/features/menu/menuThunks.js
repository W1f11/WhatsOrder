import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


// fetch all menu items

export const fetchMenu = createAsyncThunk(
    "menu/fetchMenu",
    async () => {
        const res = await api.get("/menu");
        return res.data;
    }
);

// Fetch one menu item 

export const fetchMenuItem = createAsyncThunk(
    "menu/fetchMenuItem", 
    async (id) => {
        const res = await api.get(`/menu/${id}`);
        return res.data;
    }
);