const User = require('../models/user'); 
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const sequelize=require('../util/database')
const { Op } = require('sequelize');



function generateAccessToken(id, userName,userEmail, 
  disableUser, 
  userGroup,
  readOnly,
  Write,
  imports ,
  exports,
  reports,
  reports_all,
  userManagement ,
  vendorManagement,
  master_create
  ) {
  return jwt.sign({ userId: id, userName: userName,userEmail:userEmail,disableUser:disableUser,userGroup:userGroup,readOnly:readOnly,Write:Write,imports:imports,exports:exports,reports:reports,reports_all:reports_all,userManagement:userManagement,vendorManagement:vendorManagement,
    master_create:master_create
  }, 'secretkey');
}


const create_user = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    // Get user information from the authenticated user
const id = req.params.id;
console.log(id)
    const {
      userName,
      lastName,
      userEmail,
      userPassword,
      userCPassword,
      userPhone,
      userVendor,
      userClient,
      createdBy,
      master_create,
      disableUser,
      readOnly,
      Write,
      imports,
      exports,
      reports,
      reports_all,
      userManagement,
      vendorManagement,
      userGroup

    } = req.body;

    console.log(req.body);
    const saltrounds = 10;

    const user = await User.findByPk(id)
    console.log(user)
    let userGroups = user.dataValues.userGroup
    let userManagements = user.dataValues.userManagement

    // Authorization logic based on the user's own attributes
    if (userGroups === 'admin' || (userGroups === 'vendor' && userManagements)) {
      bcrypt.hash(userPassword, saltrounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ message: "Error hashing password" });
        }

        try {
          const newUser = await User.create({
            userName,
            lastName,
            userEmail,
            userPassword: hash,
            userCPassword,
            userPhone,
            userGroup,
            userVendor,
            userClient,
            createdBy,
            master_create,
            disableUser,
            readOnly,
            Write,
            imports,
            exports,
            userManagement,
            vendorManagement,
            reports,
            reports_all,
          },{transaction:t});
          await t.commit();
          res.status(201).json({ message: "Successfully Created New User", user: newUser });
        } catch (err) {
          await t.rollback();
          console.error("Error creating user:", err);
          res.status(500).json({
            message: "Error creating user",
            error: err
          });
        }
      });
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      message: "Unexpected error",
      error: err
    });
  }
};


  // Endpoint to edit a user
// Endpoint to edit a user
// const edit_user = async (req, res) => {
//   const t = await sequelize.transaction();
//   const userId = req.params.id;
//   console.log(req.body);

//   try {
//     // Find the user by ID
//     const user = await User.findByPk(userId);

//     // If the user does not exist, return a 404 response
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update the user fields with the new data
//     user.userName = req.body.userName;
//     user.lastName = req.body.lastName;
//     user.userEmail = req.body.userEmail;
//     user.userPhone = req.body.userPhone;
//     user.userGroup = req.body.userGroup;
//     user.userVendor = req.body.userVendor;
//     user.userClient = req.body.userClient;
//     user.createdBy = req.body.createdBy;
//     user.master_create=req.body.master_create;
//     user.disableUser = req.body.disableUser;
//     user.readOnly = req.body.readOnly;
//     user.Write = req.body.Write;
//     user.imports = req.body.imports;
//     user.exports = req.body.exports;
//     user.userManagement = req.body.userManagement;
//     user.vendorManagement=req.body.vendorManagement;
//     user.reports = req.body.reports;

//     // Check if a new password is provided
//     if (req.body.userPassword.length >50) { console.log('No changes present')}
//     else{
//       const saltrounds = 10;

//       // Hash the new password
//       const hash = await bcrypt.hash(req.body.userPassword, saltrounds);
//       user.userPassword = hash;
//     }
//     // Save the updated user
//     await user.save();

//     // Fetch the updated user after saving changes
//     const updatedUser = await User.findByPk(userId);

//     res.status(200).json({
//       message: 'User updated successfully',
//       user: updatedUser
//     });
//   } catch (error) {
//     console.error('Error during user update:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

const edit_user = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.params.id;
    const userData = req.body;

    // Find the user by ID
    const user = await User.findByPk(userId);

    // If the user does not exist, return a 404 response
    if (!user) {
      await t.rollback(); // Rollback transaction if user not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields with the new data
    user.userName = userData.userName;
    user.lastName = userData.lastName;
    user.userEmail = userData.userEmail;
    user.userPhone = userData.userPhone;
    user.userGroup = userData.userGroup;
    user.userVendor = userData.userVendor;
    user.userClient = userData.userClient;
    user.createdBy = userData.createdBy;
    user.master_create = userData.master_create;
    user.disableUser = userData.disableUser;
    user.readOnly = userData.readOnly;
    user.Write = userData.Write;
    user.imports = userData.imports;
    user.exports = userData.exports;
    user.userManagement = userData.userManagement;
    user.vendorManagement = userData.vendorManagement;
    user.reports = userData.reports;
    user.reports_all = userData.reports_all;

    // Check if a new password is provided and hash it
    if (userData.userPassword && userData.userPassword.length <= 50) {
      const saltrounds = 10;
      const hash = await bcrypt.hash(userData.userPassword, saltrounds);
      user.userPassword = hash;
    }

    // Save the updated user within the transaction
    await user.save({ transaction: t });

    await t.commit(); // Commit the transaction

    // Fetch the updated user after saving changes
    const updatedUser = await User.findByPk(userId);

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    await t.rollback(); // Rollback the transaction in case of error
    console.error('Error during user update:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const login = async (req, res, next) => {
  try {
    const { userName, userPassword } = req.body 

    // Find the user with the provided username
    const user = await User.findOne({ where: { userName: userName } });

    if (user) {
      // Compare the provided password with the stored hashed password in the database
      bcrypt.compare(userPassword, user.userPassword, (err, passwordMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        if (passwordMatch) {
          // Password is correct, generate JWT token
          // console.log("}}}}}}}}}}}}}}}}}}}}",user.id, user.userName,user.userEmail, user.disableUser,user.userGroup,user.readOnly,user.Write,user.imports,user.exports,user.userManagement,user.vendorManagement,user.reports,user.reports_all,user.master_create)
          const token = generateAccessToken(user.id, user.userName,user.userEmail, user.disableUser,user.userGroup,user.readOnly,user.Write,user.imports,user.exports,user.reports,user.reports_all,user.userManagement,user.vendorManagement,user.master_create);
          console.log(token);
          return res.status(200).json({
            success: true,
            message: 'User Logged in Successfully',
            token: token,
            username: user.userName,
            userId:user.id,
            // master_create:user.master_create,
            // disableUser:user.disableUser,
            // userGroup:user.userGroup,
            // readOnly:user.readOnly,
            // Write:user.Write,
           
            // imports:user.imports,
            // exports:user.exports,
            // userManagement:user.userManagement,
            // reports:user.reports,
            // reports_all:user.reports_all
            
          });
        } else {
          // Password is invalid
          return res.status(400).json({ success: false, message: 'Password is invalid' });
        }
      });
    } else {
      // User does not exist
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const get_user = async(req,res)=>{
    const id = req.params.id;
    console.log('>>>>>>>',id)
    try {
      // Fetch user data from the database
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Send user data as response
      res.json({ user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: "Server error" });
    }
  }


const view_user = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.userEmail;
    console.log(userId);
    console.log('User Email:', userEmail);
    let userGroup;

    // Fetch user data by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    userGroup = user.dataValues.userGroup;
    readOnly = user.dataValues.readOnly
    console.log('User Group:', userGroup);

    let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
    let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10

    // Calculate the offset based on the page and limit
    let offset = (page - 1) * limit;

    if (userGroup === 'admin' ) {
      // If the user is an admin, fetch only their own data (excluding disabled users) with pagination
      const allUsers = await User.findAll({
        offset,
        limit,
        where: {
          [Op.or]: [
            { id: userId },
            { master_create: { [Op.like]: `%${userEmail}%` } }
          ],
          disableUser: false
        }
      });

      const totalCount = await User.count({
        where: {
          disableUser: false
        }
      });

      res.status(200).json({ users: allUsers, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page, success: true });
    } else if (userGroup === 'vendor' && readOnly) {
      // If the user is a vendor, fetch either their own data by ID or by master_create containing userEmail with pagination
      const allUsers = await User.findAll({
        offset,
        limit,
        where: {
          [Op.or]: [
            { id: userId },
            { master_create: { [Op.like]: `%${userEmail}%` } }
          ],
          disableUser: false
        }
      });

      const totalCount = await User.count({
        where: {
          [Op.or]: [
            { id: userId },
            { master_create: { [Op.like]: `%${userEmail}%` } }
          ],
          disableUser: false
        }
      });

      res.status(200).json({ users: allUsers, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page, success: true });
    } else if (userGroup === 'SA') {
      // If the user is SA, fetch all users (including disabled) with master_create containing userEmail with pagination
      const allUsers = await User.findAll({
        offset,
        limit
      });

      const totalCount = await User.count();

      res.status(200).json({ users: allUsers, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page, success: true });
    } else {
      // Handle other user groups or restrict access as needed
      res.status(403).json({ message: 'Access forbidden', success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err, message: 'Internal Server Error', success: false });
  }
};







const delete_user = async (req, res) => {
  const id = req.params.id;
  try {
      // Check user's authorization
const user = await User.findByPk(id)
let userGroup = user.dataValues.userGroup
let Write = user.dataValues.Write
      // Only allow deletion if user is an admin or a vendor with Write permission
      if (userGroup === 'admin' || (userGroup === 'vendor' && Write)) {
          // Delete user with the specified id
          const deletedUser = await User.destroy({ where: { id: id } });

          // Check if the user was deleted
          if (deletedUser > 0) {
              res.status(200).json({ success: true });
          } else {
              res.status(404).json({ error: 'User not found', success: false });
          }
      } else {
          res.status(403).json({ error: 'Unauthorized', success: false });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};



  
module.exports = {
  create_user,
  edit_user,
  login,
  view_user,
  delete_user,
  get_user
};
