"use client";
import React, { useState } from 'react';

import { 
  User, 
  
} from 'lucide-react';


interface User {
  id: string;
  email: string;
  role: 'admin' | 'student' | 'parent';
  name: string;
}

interface UserDashboardProps {
  user: User;

}

const UserDashboard = ({ user }: UserDashboardProps) => {
  return (
    <>
      
    </>
  )
};

export default UserDashboard;