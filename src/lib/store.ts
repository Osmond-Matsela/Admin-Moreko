import {configureStore } from '@reduxjs/toolkit'
import User from './UserSlice'
import Parent from './ParentsSlice'
import Content from './ContentSlice'

export default configureStore({
  reducer: {
    User,
    Parent,
    Content
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })

})