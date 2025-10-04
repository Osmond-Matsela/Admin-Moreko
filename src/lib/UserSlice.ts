import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name: "User",
    initialState: {
        
    },
    reducers: {
        setUsers(state, action){
            
        }
    },
});

export const { setUsers } = UserSlice.actions;
export default UserSlice.reducer;