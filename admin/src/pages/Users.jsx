import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Users = ({ token }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/admin/all', {}, {
        headers: { token }
      });
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.post(backendUrl + '/api/user/admin/delete', 
        { userId }, 
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const response = await axios.post(backendUrl + '/api/user/admin/status', 
        { userId, status }, 
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(`User ${status === 'active' ? 'activated' : 'suspended'} successfully`);
        fetchUsers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <p className="mb-2">All Users</p>
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_2fr_2fr_1fr_1fr_2fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>ID</b>
          <b>Name</b>
          <b>Email</b>
          <b>Status</b>
          <b>Date</b>
          <b>Actions</b>
        </div>
        {users.map((user, index) => (
          <div className="grid grid-cols-[1fr_2fr_2fr] md:grid-cols-[1fr_2fr_2fr_1fr_1fr_2fr] items-center gap-2 py-1 px-2 border text-sm" key={index}>
            <p>{user._id.slice(-6)}</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p className={`hidden md:block ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
              {user.status || 'active'}
            </p>
            <p className="hidden md:block">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => updateUserStatus(user._id, user.status === 'active' ? 'suspended' : 'active')}
                className={`px-3 py-1 rounded text-xs ${
                  user.status === 'active' 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {user.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
              <button 
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;