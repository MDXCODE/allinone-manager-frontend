'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authProvider';

const Dashboard = () => {
  const { user, loading, error, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If needed, check authentication status or fetch user data here
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Not authenticated</div>;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); // Ensure the user is redirected after logout
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome to your dashboard</h1>
      <ul>
        <li><strong>Username:</strong> {user.user_name}</li>
        <li><strong>Email:</strong> {user.user_email}</li>
        <li><strong>First Name:</strong> {user.user_first_name}</li>
        <li><strong>Last Name:</strong> {user.user_last_name}</li>
      </ul>
      <button
        onClick={handleLogout}
        className="p-2 bg-red-600 text-white w-fit rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
