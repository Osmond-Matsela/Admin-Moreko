import { createSlice } from "@reduxjs/toolkit";


const ParentSlice = createSlice({
    name: "Parent",
    initialState: [],
    reducers: {
        setParent: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const {  } = ParentSlice.actions;
export default ParentSlice.reducer;