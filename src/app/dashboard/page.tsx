"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authProvider';
import "../css/dashboard.css";

const Dashboard = () => {
  const { user, loading, error, logout } = useAuth();
  const router = useRouter();
  const reloadCount = Number(sessionStorage.getItem('reloadCount')) || 0;

  useEffect(() => {
    if(reloadCount < 2) {
      sessionStorage.setItem('reloadCount', String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloadCount');
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Not authenticated</div>;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); 
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="main-dashboard-container">
      <div className="dashboard-title">
        <h1>Dashboard</h1>
        <h4>The AllInOne User Dashboard</h4>
      </div>
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