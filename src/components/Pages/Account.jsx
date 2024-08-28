import React from 'react'
import { BsPersonCircle } from "react-icons/bs";

const Account = () => {
  return (
    <div className="account-container">
      <div className="profile-container">
        <div className="profile-picture">
          <BsPersonCircle />
        </div>
        <div className="profile-header">Jane Doe</div>
        <div className="profile-subheader">fake@fake.com</div>
        <label for="first name">
          <b>First Name</b>
        </label>
        <input
          aria-label="first name"
          type="text"
          placeholder="First Name"
          name="first name"
          required
        />

        <label for="last name">
          <b>Last Name</b>
        </label>
        <input
          aria-label="last name"
          type="text"
          placeholder="Last Name"
          name="last name"
          required
        />
        <button className="update-button">Update</button>
      </div>

      <div className="security-container">
        <div className="security-header">Sign-in & Security</div>
        <div className="security-text">
          {"Update your email or password used to sign in "}
        </div>
        <label for="email">
          <b>Email</b>
        </label>
        <input
          aria-label="email"
          type="text"
          placeholder="Enter Email"
          name="email"
          required
        />

        <label for="password">
          <b>Password</b>
        </label>
        <input
          aria-label="password"
          type="text"
          placeholder="Enter Password"
          name="password"
          required
        />

        <label for="repeat-password">
          <b>Repeat Password</b>
        </label>
        <input
          aria-label="repeat-password"
          type="text"
          placeholder="Repeat Password"
          name="repeat-password"
          required
        />

        <label>
          <input
            aria-label="remember-me-checkbox"
            type="radio"
            checked="checked"
            name="remember"
            style={{ marginRight: "0.5rem" }}
          />
          2-Step Verification
        </label>
        <button className="update-button">Update</button>
      </div>
    </div>
  )
}

export default Account