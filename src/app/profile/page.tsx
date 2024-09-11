"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/auth-context/authProvider";
import { useAuxRequests } from "../../context/api-context/auxRequests";
import Image from "next/image";
import profilePlaceholder from "../../images/profile-images/placeholder.jpg";
import "../../css/pages-css/profile.css";

const ProfilePage = () => {
  const { push } = useRouter();
  const { user } = useAuth();
  const { updateUserDetails } = useAuxRequests();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [username, setUsername] = useState<string>(user?.user_name || "");
  const [email, setEmail] = useState<string>(user?.user_email || "");
  const [firstName, setFirstName] = useState<string>(user?.user_first_name || "");
  const [lastName, setLastName] = useState<string>(user?.user_last_name || "");

  const userDetailsButtonRef = useRef<HTMLButtonElement | null>(null);
  const saveUserDetailsButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.user_name);
      setEmail(user.user_email);
      setFirstName(user.user_first_name);
      setLastName(user.user_last_name);
    }
  }, [user]);

  useEffect(() => {
    const saveButton = saveUserDetailsButtonRef.current;
    const editCancelButton = userDetailsButtonRef.current;

    if (isEditMode) {
      if (editCancelButton) editCancelButton.id = "cancel-button";
      if (saveButton) saveButton.disabled = false;
    } else {
      if (editCancelButton) editCancelButton.id = "edit-button";
      if (saveButton) saveButton.disabled = true;
    }
  }, [isEditMode]);

  const handleEditToggle = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submittedUsername = username !== user?.user_name ? username : user?.user_name || '';
    const submittedEmail = email !== user?.user_email ? email : user?.user_email || '';
    const submittedFirstName = firstName !== user?.user_first_name ? firstName : user?.user_first_name || '';
    const submittedLastName = lastName !== user?.user_last_name ? lastName : user?.user_last_name || '';

    if (
      submittedUsername !== user?.user_name ||
      submittedEmail !== user?.user_email ||
      submittedFirstName !== user?.user_first_name ||
      submittedLastName !== user?.user_last_name
    ) {
      try {
        await updateUserDetails(submittedUsername, submittedFirstName, submittedLastName, submittedEmail);
        setSuccessMessage(true);
        handleEditToggle();

        setTimeout(() => {
          setSuccessMessage(false);
        }, 5000);
      } catch (e) {
        setErrorMessage('Failed to update user details. Please try again.');
      }
    } else {
      setErrorMessage('No changes detected.');
    }
  };

  if (!user) return <div>Not authenticated</div>;

  return (
    <div className="main-profile-container">
      <title>Profile Page</title>

      <div className="profile-page-titles">
        <h2 className="profile-page-titles-main-title">Hello {user.user_name}!</h2>
        <h4 className="profile-page-titles-sub-title">Here you can View or Edit your User Profile</h4>
      </div>

      <div className="profile-page">

        <div className="profile-summary-container">
        <h1>Profile Summary</h1>
        <p>Here you can see a brief summary of your profile information.</p>
        </div>


        <div className="profile-image-container">
          <h1 className="profile-image-title">Profile Image</h1>
          <div className="profile-image-input-container">
            <div className="profile-image-input-container-image-placeholder">
              <Image
                src={profilePlaceholder}
                className="profile-image-input-container-image"
                width={500}
                height={500}
                alt="Profile Placeholder"
              />
            </div>

            <div>
              <div className="profile-image-input-container-buttons">
                <button className="change-photo-button">Change Photo</button>
                <button className="remove-button">Remove</button>
              </div>

              <div className="profile-image-input-recommended-text">
                <p>Recommended photo size is 256x256px</p>
              </div>
            </div>
          </div>
        </div>



        <div className="profile-user-details-container">
          <div className="profile-user-details-titles">
            <h1 className="user-details-title">View/Edit User Details</h1>
            {successMessage && (
              <h3 style={{ color: "#FFF733" }}>Success!</h3>
            )}
          </div>
          <div className="profile-user-details-input-container">
            <form onSubmit={handleSubmit}>
              <div className="input-full-width-labels">
                <h4>User Name</h4>
              </div>
              <div className="input-full-width">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border rounded border-black input-field"
                  placeholder="User Name"
                  readOnly={!isEditMode}
                />
              </div>

              <div className="input-half-width-labels">
                <h4>First Name</h4>
                <h4>Last Name</h4>
              </div>
              <div className="input-half-width">
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="border rounded border-black input-field"
                  placeholder="First Name"
                  readOnly={!isEditMode}
                />
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="border rounded border-black input-field"
                  placeholder="Last Name"
                  readOnly={!isEditMode}
                />
              </div>

              <div className="input-full-width-labels">
                <h4>Email</h4>
              </div>
              <div className="input-full-width">
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border rounded border-black input-field"
                  placeholder="Email"
                  readOnly={!isEditMode}
                />
              </div>
              <div className="profile-user-details-buttons">
                <button
                  id="edit-button"
                  type="button"
                  ref={userDetailsButtonRef}
                  onClick={handleEditToggle}
                >
                  {isEditMode ? "Cancel" : "Edit"}
                </button>
                <button
                  id="save-button"
                  type="submit"
                  ref={saveUserDetailsButtonRef}
                  disabled={!isEditMode}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        
        <div className="profile-additional-settings-input-container"></div>
      </div>
    </div>
  );
};

export default ProfilePage;
