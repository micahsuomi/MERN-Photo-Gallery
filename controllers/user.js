const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthorized = require("../middleware/authorized");
const User = require("../models/User");
const Photo = require("../models/Photo");
const UserService = require("../services/users");
const multer = require("multer");
const cloudinary = require("cloudinary");

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });

cloudinary.config({
  cloud_name: "du66vzeok",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//@POST ROUTE /api/user
//@DESC - registers user
//@ACCESS Public
const register = (req, res) => {
  const { name, email, password } = req.body;
  //if any of the fields are empty, throw warning with 400 err (bad request)
  if (!name || !email || !password) {
    res.status(400).json({ msg: "please enter all fields" });
  }

  //check for existing user using the email, throw 400 err
  User.findOne({ email }).then((user) => {
    if (user)
      return res
        .status(400)
        .json({ msg: "A user with this email is already registered" });
    const newUser = new User({
      name,
      email,
      password,
    });

    //if no user exists, generate salt which is used to hash a password with bcryptjs
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        (newUser.password = hash),
          //save the user as new user within mongoose schema
          newUser.save().then((user) => {
            //send the token, create object for user with id, name and user email
            jwt.sign(
              { id: user.id },
              process.env.jwtSecret,
              //we set an expiration for the token
              { expiresIn: "30d" },
              (err, token) => {
                if (err) throw err;
                //we make a json file for token and user
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                  },
                });
              }
            );
          });
      });
    });
  });
};

//@GET ROUTE /api/v1/user
//@DESC - finds all users
//@ACCESS Public
const findAll = async (req, res) => {
  try {
    const user = await UserService.findAllUsers()
    res.json(user);
  } catch (err) {
    return res.status(404).json({ msg: "Not Found" });
  }
};

//@GET ROUTE /api/v1/user/:id
//@DESC - finds  a single user
//@ACCESS Public
const findOne = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserService.findUserById(userId)
    res.json(user);
  }
  catch (err) {    
    return res.status(404).json({ msg: "Not Found" });
  }
}

//@PUT ROUTE /api/v1/user/:id
//@DESC - updates a user
//@ACCESS Private
const updateUser =
  (isAuthorized,
  upload.single("image"),
  (req, res) => {
    const id = req.params.id;
    const { name, email, bio } = req.body;
    const fileImage = req.body.avatar;
    cloudinary.uploader.upload(fileImage, function (result) {
      console.log("result is here", result);
      const uploadedCloudinaryImage = result.secure_url;

      User.findById(id)
        .then((user) => {
          console.log(user);
          (user.name = name),
            (user.email = email),
            (user.avatar = uploadedCloudinaryImage),
            (user.bio = bio);
          Photo.find()
            .where("author.id")
            .equals(user._id)
            .exec((err, foundGallery) => {
              if (err) {
                console.log(err);
              } else {
                for (const gallery of foundGallery) {
                  gallery.author.name = user.name;
                  gallery.author.avatar = user.avatar;
                  gallery.author.bio = user.bio;
                  console.log("here the gallery should update", gallery);
                }
              }

              //to save all the multiple updated mongoose documents

              let total = foundGallery.length;
              let result = [];
              if (total > 0) {
                const saveAll = () => {
                  let doc = foundGallery.pop();

                  doc.save((err, saved) => {
                    if (err) throw err; //handle error

                    result.push(saved[0]);
                    console.log(result);

                    if (--total) saveAll();
                    else console.log("saved here"); // all saved here
                  });
                };

                saveAll();
              }
              user.save().then((updatedUser) => res.json(updatedUser));
            });
        })
        .catch((err) => res.status(404).json({ success: false }));
    });
  });

module.exports = {
  register,
  findAll,
  findOne,
  updateUser,
};
