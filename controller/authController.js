const dbConnection = require('../middleware/connection');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const authToken = require('../middleware/AuthToken');


//Signup
exports.signup = async (req, res)=>{
    try {
        const {firstName, lastName, username, password, role} = req.body;

        //Check all fields are filled
        if(!firstName || !lastName || !username || !password || !role){
            return res.status(400).json({Error: "All fields are required"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO user (firstName, lastName, username, password, role) VALUES (?, ?, ?, ?, ?)";
        const values = [firstName, lastName, username, hashedPassword, role];

        const [result] = await dbConnection.execute(sql, values);
        if(result.affectedRows > 0){
            res.status(200).json({success: true, Message: "User created successfully"})
        }else{
            res.status(500).json({Error: "Insertion error"});
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//Login
exports.signin = async (req, res) => {
    try {
        const { enteredUsername, enteredPassword } = req.body;
        if (!enteredUsername || !enteredPassword) {
            return res.status(500).json({error: "All fields are required" });
        }

        const values = [enteredUsername, enteredPassword];
        const sql = "SELECT * FROM user WHERE username = ? AND password = ?";
        const [result] = await dbConnection.execute(sql, values);

        const generateJwt=()=>{
            const payLoad={role: result[0].role}
            // const secretKey = process.env.SECRET_KEY;
            const secretKey = "asdasdad-asdasdad-advsfsf";
            const options={expiresIn:"1hr"}
            
            //Create the token using sign in method
            const token = jwt.sign(payLoad,secretKey,options);
            return token;
        }

        if (result.length === 0 || result[0].username !== enteredUsername || result[0].password !== enteredPassword) {
            return res.status(500).json({ error: "Enter valid username or password" });
        } else {
            // Generate token
            const token = generateJwt(); 
            return res.status(200).json({ message: "Login successful", token});
        }

    } catch (error) {
        res.status(500).json({error: "Internal server error" });
        console.error(error.message);
    }
}

