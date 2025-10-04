"use client";
import React, { useState } from "react";
import { UserPlus, User, Phone, GraduationCap, Edit, Trash2, Save, X, Plus } from "lucide-react";
import { useDatabase } from "@/context/Database";
import Loader from "../HomePage/Loader";
const voucher_codes = require("voucher-code-generator");


interface Child {
  id: string;
  name: string;
  grade: string;
}

interface User {
  id: string;
  name: string;
  phone: string;
  children: Child[];
  addedDate: string;
}

interface NewUser {
  id: string;
  name: string;
  phone: string;
  children: Child[];
}

const UserManagement: React.FC = () => {
  const [showAddUsersForm, setShowAddUsersForm] = useState(false);
  const { parents, setParents } = useDatabase();
  const [loading, setLoading] = useState(false);

  const generateUniqueCode = (prefix: string):string => {
  return voucher_codes
    .generate({
      count: 1,
      length: 10,
      prefix: prefix,
      charset: "alphabetic",
    })[0]
    .toUpperCase();
};

  const [newUsers, setNewUsers] = useState<NewUser[]>([
    {
      id: generateUniqueCode("PARENT-"),
      name: "",
      phone: "",
      children: [{ id: generateUniqueCode("CHILD-"), name: "", grade: "" }]
    }
  ]);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const grades: string[] = [
    "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"
  ];

  

  const addNewUserForm = (): void => {
    if (newUsers.length < 5) {
      setNewUsers([
        ...newUsers,
        {
          id: generateUniqueCode("PARENT-"),
          name: "",
          phone: "",
          children: [{ id: generateUniqueCode("CHILD-"), name: "", grade: "" }]
        }
      ]);

    console.log(newUsers);
    }
  };

  const removeUserForm = (userId: string): void => {
    if (newUsers.length > 1) {
      setNewUsers(newUsers.filter(user => user.id !== userId));
    }
  };

  const updateNewUser = (userId: string, field: keyof Omit<NewUser, 'id' | 'children'>, value: string): void => {
    setNewUsers(newUsers.map(user => 
      user.id === userId ? { ...user, [field]: value } : user
    ));
  };

  const addChildToNewUser = (userId: string): void => {
    setNewUsers(newUsers.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            children: [...user.children, { id: generateUniqueCode("CHILD-"), name: "", grade: "" }]
          }
        : user
    ));
  };

  const removeChildFromNewUser = (userId: string, childId: string): void => {
    setNewUsers(newUsers.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            children: user.children.filter(child => child.id !== childId)
          }
        : user
    ));
  };

  const updateNewUserChild = (userId: string, childId: string, field: keyof Omit<Child, 'id'>, value: string): void => {
    setNewUsers(newUsers.map(user => 
      user.id === userId 
        ? {
            ...user,
            children: user.children.map(child => 
              child.id === childId ? { ...child, [field]: value } : child
            )
          }
        : user
    ));
  };

  const saveAllUsers = async () => {

    const validUsers = newUsers.filter(user => 
      user.name.trim() && user.phone.trim() && 
      user.children.some(child => child.name.trim() && child.grade)
    );

    const usersToAdd = validUsers.map(user => ({
      ...user,
      id: generateUniqueCode("PARENT-"),
      children: user.children.filter(child => child.name.trim() && child.grade).map(child => ({
        ...child,
        id: generateUniqueCode("CHILD-")
      })),
      addedDate: new Date().toISOString().split('T')[0]
    }));



    setLoading(true);
  
    await fetch('/api/add-parent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usersToAdd)
    }).then(res => res.json()).then(data =>
    {
      console.log(data);
      setLoading(false);
    }
      
    ).catch(err => {
      console.log(err);
      setLoading(false);
    });

    setParents([...parents, ...usersToAdd]);

    setNewUsers([{
      id: generateUniqueCode("PARENT-"),
      name: "",
      phone: "",
      children: [{ id: generateUniqueCode("CHILD-"), name: "", grade: "" }]
    }]);
    setShowAddUsersForm(false);
  };

  const startEditing = (user: User): void => {
    setEditingUser({ ...user });
  };

  const saveEdit = (): void => {
    setParents(parents.map((user: { id: string;}) => 
  user.id === editingUser?.id ? editingUser : user
) as User[]);
    setEditingUser(null);
  };

  const updateEditingUser = (field: keyof Omit<User, 'id' | 'children' | 'addedDate'>, value: string): void => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [field]: value });
    }
  };

  const addChildToEditingUser = (): void => {
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        children: [...editingUser.children, { id: generateUniqueCode("CHILD-"), name: "", grade: "" }]
      });
    }
  };

  const removeChildFromEditingUser = (childId: string): void => {
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        children: editingUser.children.filter(child => child.id !== childId)
      });
    }
  };

  const updateEditingUserChild = (childId: string, field: keyof Omit<Child, 'id'>, value: string): void => {
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        children: editingUser.children.map(child => 
          child.id === childId ? { ...child, [field]: value } : child
        )
      });
    }
  };

  const deleteUser = async (userId: string) => {
    
    await fetch(`/api/delete-parent`, { method: 'DELETE', body: JSON.stringify({ id: userId }) }).then((res) => {
      console.log(res.json().then((data) => console.log(data)));
      setParents(parents.filter((user: { id: string; }) => user.id !== userId));
    }).catch((err) => console.log(err));

  };

  if (loading) {
    return <Loader />;
  }

  else return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Manage Parents
          </h2>
          <p className="text-gray-600">
            Add and manage parents with their children information
          </p>
        </div>
        <button
          onClick={() => {setShowAddUsersForm(!showAddUsersForm)}}
          className="bg-red-800 hover:bg-red-900 text-white cursor-pointer px-4 py-2 rounded-md font-medium transition-colors flex items-center"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Users
        </button>
      </div>

      {/* Add Users Form */}
      {showAddUsersForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Add New Users (Max 5)</h3>
              <div className="flex space-x-2">
                {newUsers.length < 10 && (
                  <button
                    onClick={addNewUserForm}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Another User
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {newUsers.map((user, userIndex) => (
              <div key={user.id} className="border-l-4 border-l-blue-500 bg-white rounded-lg shadow border border-gray-200">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold">User {userIndex + 1}</h4>
                    {newUsers.length > 1 && (
                      <button
                        onClick={() => removeUserForm(user.id)}
                        className="text-red-600 hover:text-red-700 border border-gray-300 hover:border-red-300 px-2 py-1 rounded text-sm transition-colors flex items-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label htmlFor={`name-${user.id}`} className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        id={`name-${user.id}`}
                        value={user.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewUser(user.id, 'name', e.target.value)}
                        placeholder="Enter full name"
                        className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`phone-${user.id}`} className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        id={`phone-${user.id}`}
                        value={user.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewUser(user.id, 'phone', e.target.value)}
                        placeholder="e.g., +27 11 123 4567"
                        className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">Children</label>
                      <button
                        onClick={() => addChildToNewUser(user.id)}
                        className="text-blue-600 hover:text-blue-700 border border-gray-300 hover:border-blue-300 px-2 py-1 rounded text-sm transition-colors flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Child
                      </button>
                    </div>

                    {user.children.map((child, childIndex) => (
                      <div key={child.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="space-y-1">
                          <label htmlFor={`child-name-${child.id}`} className="block text-xs font-medium text-gray-700">Child Name</label>
                          <input
                            id={`child-name-${child.id}`}
                            value={child.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewUserChild(user.id, child.id, 'name', e.target.value)}
                            placeholder="Enter child's name"
                            className="block w-full px-3 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor={`child-grade-${child.id}`} className="block text-xs font-medium text-gray-700">Grade</label>
                          <select
                            id={`child-grade-${child.id}`}
                            value={child.grade}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateNewUserChild(user.id, child.id, 'grade', e.target.value)}
                            className="block w-full px-3 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                          >
                            <option value="">Select grade</option>
                            {grades.map(grade => (
                              <option key={grade} value={grade}>{grade}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          {user.children.length > 1 && (
                            <button
                              onClick={() => removeChildFromNewUser(user.id, child.id)}
                              className="text-red-600 hover:text-red-700 border border-gray-300 hover:border-red-300 px-2 py-1 rounded text-sm transition-colors flex items-center w-full justify-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex space-x-4">
              <button 
                onClick={saveAllUsers}
                className="bg-red-800 text-white hover:bg-red-900 px-6 py-2 rounded-md font-medium transition-colors"
              >
                Save All Users
              </button>
              <button
                onClick={() => {
                  setShowAddUsersForm(false);
                  setNewUsers([{
                    id: generateUniqueCode("PARENT-"),
                    name: "",
                    phone: "",
                    children: [{ id: generateUniqueCode("CHILD-"), name: "", grade: "" }]
                  }]);
                }}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer px-6 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {parents.map((user: User) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-6">
              {editingUser && editingUser.id === user.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        value={editingUser.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditingUser('name', e.target.value)}
                        className="block w-full px-3 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        value={editingUser.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditingUser('phone', e.target.value)}
                        className="block w-full px-3 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">Children</label>
                      <button
                        onClick={addChildToEditingUser}
                        className="text-blue-600 hover:text-blue-700 border border-gray-300 hover:border-blue-300 px-2 py-1 rounded text-sm transition-colors flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Child
                      </button>
                    </div>

                    {editingUser.children.map((child) => (
                      <div key={child.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700">Child Name</label>
                          <input
                            value={child.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditingUserChild(child.id, 'name', e.target.value)}
                            className="block w-full px-3 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700">Grade</label>
                          <select
                            value={child.grade}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateEditingUserChild(child.id, 'grade', e.target.value)}
                            className="block w-full px-3 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                          >
                            <option value="">Select grade</option>
                            {grades.map(grade => (
                              <option key={grade} value={grade}>{grade}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          {editingUser.children.length > 1 && (
                            <button
                              onClick={() => removeChildFromEditingUser(child.id)}
                              className="text-red-600 hover:text-red-700 border border-gray-300 hover:border-red-300 px-2 py-1 rounded text-sm transition-colors flex items-center w-full justify-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <User className="w-5 h-5 text-red-800" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700">Children:</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {user.children.map((child) => (
                          <div key={child.id} className="bg-gray-50 p-2 rounded-lg">
                            <div className="font-medium">{child.name}</div>
                            <div className="text-sm text-gray-600">{child.grade}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      Added: {user.addedDate}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => startEditing(user)}
                      className="border border-gray-300 hover:border-gray-400 p-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="border border-gray-300 hover:border-red-300 p-2 rounded-md text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;