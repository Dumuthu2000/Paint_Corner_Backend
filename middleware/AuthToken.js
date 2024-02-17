// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// module.exports = async (req, res, next) => {
//     const authorizationHeader = req.header('Authorization');

//     if (!authorizationHeader) {
//         return res.status(400).json({ Message: "Token doesn't exist" });
//     }

//     const token = authorizationHeader.split(' ')[1];

//     if (!token) {
//         return res.status(400).json({ Message: "Token is missing" });
//     }

//     try {
//         const payLoad = jwt.verify(token, process.env.SECRET_KEY);
//         req.user = payLoad;
//         next();
//     } catch (error) {
//         res.status(400).json({ Message: "Token is invalid" });
//     }
// };
