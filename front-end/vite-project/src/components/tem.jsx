import React, { useState, useEffect } from "react";
import axiosInstance from "../axios_instance.jsx";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/Styles/AddUser.css"; // reuse your CSS

const UpdateUser = () => {
  let { id } = useParams(); // fetch id from URL
  let navigate = useNavigate();
  
  // form state
  let [formData, setFormData] = useState({ id: "", name: "", age: "" });
  let [profilePic, setProfilePic] = useState(null); // new file
  let [currentPic, setCurrentPic] = useState(""); // existing pic

  // fetch user data for pre-fill
  useEffect(() => {
    axiosInstance
      .get(`/api/getsingleuser/${id}`)
      .then((res) => {
        let user = res.data;
        if (user) {
          setFormData(user);
          setCurrentPic(user.profilePic || ""); // set existing pic
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  // handle input change
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // handle form submit
  async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("age", formData.age);
    if (profilePic) data.append("profilePic", profilePic); // append new pic only if uploaded

    try {
      await axiosInstance.put(`/api/updateuser/${formData.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("User updated successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  }

  return (
    <div className="form-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Update User</h2>

        <div className="form-group">
          <label>ID</label>
          <input type="number" name="id" value={formData.id} disabled />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="1"
            max="110"
          />
        </div>

        {/* Display current profile picture */}
        <div className="form-group">
          <label>Current Profile Picture</label>
          {currentPic ? (
            <img
              src={`http://localhost:5000/uploads/${currentPic}`}
              alt="Current Profile"
              style={{ width: "100px", borderRadius: "50%" }}
            />
          ) : (
            <p>No profile picture</p>
          )}
        </div>

        {/* Upload new profile picture */}
        <div className="form-group">
          <label>Change Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
        </div>

        <button type="submit" className="submit-btn">
          Update User
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
