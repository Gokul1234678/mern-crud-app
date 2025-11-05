import React from 'react'
import Home from './components/Home'
import AddUser from './components/AddUser'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UpdateUser from './components/UpdateUser'
const App = () => {
  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/addUser" element={<AddUser/>}></Route>
          <Route path="/updateUser/:id"  element={<UpdateUser/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App