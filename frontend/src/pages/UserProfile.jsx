import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authThunks';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  if (!user) {
    return <div className="p-8">Not logged in</div>;
  }

  
  const doLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="">
      <h2 className="">Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <div className="">
        <button onClick={doLogout} className="">Logout</button>
      </div>
    </div>
  );
}