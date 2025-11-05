import React from 'react'
import { useState } from 'react'
import axiosInstance from "../axios_instance.jsx"
import { useNavigate } from 'react-router-dom'
import "../assets/Styles/AddUser.css"


const AddUser = () => {
  let navigate = useNavigate()
  let [loading, setLoading] = useState(false);

  let [formData, setformData] = useState({ id: "", name: "", age: "" });
  let [file, setFile] = useState(null);

  // Handle input change
  function handleChange(e) {
    setformData({ ...formData, [e.target.name]: e.target.value })
  }
  // console.log(formData);
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // ✅ Start loading

    // ✅ FormData to send text + file
    const data = new FormData(); //This line creates a FormData object, which is a built-in browser feature.
    // 💡Purpose:
    // FormData helps send both text and files (like images) to the backend together.

    data.append("id", formData.id);
    data.append("name", formData.name);
    data.append("age", formData.age);
    if (file) {
      data.append("profilePic", file);
    }

    try {
      await axiosInstance.post("/api/adduser", data, {
        headers: { "Content-Type": "multipart/form-data" },
        // This tells the backend: “I’m sending a form that contains files and text.”
      });
      alert("User added!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
    finally {
      setLoading(false); // ✅ Stop loading
    }
  }

  function handleFileChange(e) {
    console.log(e.target.files);  
    setFile(e.target.files[0]);
    // e.target.files = [ File { name: "photo.png", size: 24500, type: "image/png", ... }]
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">

      {loading && <p className="loading">Uploading... Please wait ⏳</p>}
      {/* The && operator here means:"If the left side is true, show the right side (the HTML)." */}

        <h2>Add New User</h2>
        <div className="form-group">
          <label htmlFor="id">ID</label>
          <input
            id="id"
            type="number"
            name="id"
            onChange={handleChange}
            required
            value={formData.id}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            onChange={handleChange}
            required
            value={formData.name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            name="age"
            onChange={handleChange}
            required
            value={formData.age}
          />
        </div>

        <div>
          <label>Profile Pic :<b>We only Accept .png, .jpg, .jpeg</b></label>
         <br /> <input type="file" accept=".png, .jpg, .jpeg" onChange={handleFileChange} />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  )
}

export default AddUser