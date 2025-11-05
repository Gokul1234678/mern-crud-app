let mongoose = require("mongoose")
let express = require("express")
let app = express()
let cors = require("cors")
require("dotenv").config();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./config/cloudinary"); // import your config file

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_profiles",         // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });
// ✅ What happens here:
// When a user uploads a file, Multer sends it directly to Cloudinary.
// Cloudinary returns a secure URL (like https://res.cloudinary.com/...).
// That URL is automatically available at req.file.path.


app.use(cors())
// CORS is a mechanism that tells the browser:
// "Hey, it’s okay for this frontend (domain/port) to talk to this backend."

app.use(express.json())

// ✅ Define connectDB function inside this file
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("🔁 Already connected to MongoDB");
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
};

// Connect once at startup
connectDB();

let userSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  profilePic: { type: String }  // store image  url  (not the image itself)
})

let userCollection = mongoose.model("crud_db", userSchema)


//get All user API
app.get("/api/getusers", async (req, res) => {
  try {
    let data = await userCollection.find();
    // console.log(data);
    res.status(200).json(data)
  }
  catch (err) {
    console.log(err)
  }
})



// API for adding new user
app.post("/api/adduser", upload.single("profilePic"), async (req, res) => {
  try {
    // console.log(req.file);
    
    let { id, name, age } = req.body;
const profilePic = req.file ? req.file.path : null;

// console.log(req.file);

    if (!id || !name || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let newUser = new userCollection({ id, name, age, profilePic });
    await newUser.save();

    res.status(201).json({ message: "New user added", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Update user
app.put("/api/updateuser/:id", upload.single("profilePic"), async (req, res) => {
  try {
    let { id } = req.params;
    let { name, age } = req.body;
    // console.log( req.file );

const profilePic = req.file ? req.file.path : undefined;

    let updateFields = { name, age };
    if (profilePic) {
      updateFields.profilePic = profilePic;
    }

    // update user by "id" field (not Mongo _id)
  let updatedUserData = await userCollection.findOneAndUpdate(
        { id: id },
        { $set: updateFields },
        { new: true }
      );
//   { new: true }
      //     This is an option for findOneAndUpdate.
      //     By default, MongoDB returns the old document(before update).
      //  If you add { new: true }, it will return the updated document(after changes).
      
    if (!updatedUserData) {
      return res.status(404).json({ message: "User not found" });
    }
    
   
    
    // sending response
    res.status(200).json({ message: "User updated", user: updatedUserData });

    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }

})
// api for get single user by id
app.get("/api/getsingleuser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userCollection.findOne({ id: id });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// delete user
app.delete("/api/delete/:id",async (req,res)=>{
  try{
    console.log("delete api called");
    
      let {id}=req.params;
      let deletedUser= await userCollection.findOneAndDelete({id:id})

      if(!deletedUser){
          res.status(404).json({ message: "User not found"})
      }

      // sent successfully deleted
      res.status(200).json({ message: "User deleted successfully", user: deletedUser })

    }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

})
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
