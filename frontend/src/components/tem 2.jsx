import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import axios from "axios"
import axiosInstance from "../axios_instance.jsx"
import "../assets/Styles/Home.css"
const Home = () => {
  let navigate = useNavigate()

  let [loading, setLoading] = useState(true)
  let [arrayData, setarrayData] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/api/getusers");
        setarrayData(res.data);
        // console.log(res.data[0].id);
      } catch (err) {
        console.error(err);
      }
      finally {
        setLoading(false)
      }
    };

    fetchUsers(); // call the async function
  }, []);

  // delete
  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        let res = await axiosInstance.delete(`/api/delete/${id}`);
        // console.log(res);

        if (res.status === 404) {
          return alert("User not found");
        }
        // remove deleted user from UI without reload
        setarrayData(arrayData.filter(user => user.id !== id));
        // arrayData.filter(...) → creates a new array containing all users except the one with the deleted id.
        // Then setarrayData() updates the state with this new array.
      }
      catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete user");
      }
    }
  }



  return (
    <>
      <h2>All users</h2>

      <Link to={'addUser'}>
        <button className="add">Add User</button>
      </Link>

      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>age</th>
            <th colSpan="2">Action</th>
          </tr>
        </thead>
        <tbody>
          {
            loading ? (
              <tr>
                <td colSpan="5" className="no-data">Data is loading...</td>
              </tr>
            )
              : arrayData && arrayData.length > 0
                ?
                arrayData.map((i) => (
                  <tr key={i._id}>
                    <td>{i.id}</td>
                    <td>{i.name}</td>
                    <td>{i.age}</td>
                    <td><button className="update" onClick={() => { navigate(`/updateUser/${i.id}`) }}>Update</button></td>
                    <td><button className="delete" onClick={() => handleDelete(i.id)}>Delete</button></td>
                  </tr>
                ))
                : (
                  <tr>
                    <td colSpan="5" className="no-data">Data not found</td>
                  </tr>
                )
          }
        </tbody>
      </table>
    </>

  )
}

export default Home