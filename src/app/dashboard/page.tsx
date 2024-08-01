'use client';

import { useState, useEffect } from 'react';
import useAuth from '../../context/useAuth';

interface User {
  user_name: string;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
}

const Profile = () => {
  useAuth(); 

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //console.log('Profile component mounted');
    const fetchUserData = async () => {
     // console.log('Fetching user data');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/users/details`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        } else {
          const errorText = await res.text();
          setError(`Failed to fetch user details: ${errorText}`);
        }
      } catch (error) {
        setError(`Error fetching user data: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div className="profile">
      <h1>Welcome to my dashboard</h1>
      <ul>
        <li><strong>Username:</strong> {user.user_name}</li>
        <li><strong>Email:</strong> {user.user_email}</li>
        <li><strong>First Name:</strong> {user.user_first_name}</li>
        <li><strong>Last Name:</strong> {user.user_last_name}</li>
      </ul>
    </div>
  );
};

export default Profile;
