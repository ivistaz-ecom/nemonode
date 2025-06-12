const User=require("../models/user");
 const jwt=require('jsonwebtoken');
// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers['authorization']; // Access the Authorization header
        // console.log(token)
        if (!token) {
            return res.status(401).json({ message: 'Authorization header missing', success: false });
        }

        const userdata = jwt.verify(token, 'secretkey');
        // console.log(userdata)
        // Fetch session information from the server based on userdata.userId
        const user = await User.findByPk(userdata.userId);
        // console.log(user)
        if (!user) {
            return res.status(401).json({ message: 'User not found', success: false });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};

const authenticateEmloyee = async (req, res, next) => {
    try {
        const token = req.headers['authorization']; // Access the Authorization header
         console.log(token)
        if (!token) {
            return res.status(401).json({ message: 'Authorization header missing', success: false });
        }

        const userdata = jwt.verify(token, 'secretkey');
        console.log(userdata)
        // Fetch session information from the server based on userdata.userId
        const user = await Employee.findByPk(userdata.employeeID);
        // console.log(user)
        if (!user) {
            return res.status(401).json({ message: 'User not found', success: false });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log(err, 'errerrerr')
        res.status(500).json({ message: err.message, success: false });
    }
};

module.exports = {
    authenticate, authenticateEmloyee
};
