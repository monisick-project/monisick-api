import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Get Users
export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
};

// Register
export const Register = async (req, res) => {
    const { name, email, password, confPassword } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" });

    const existingUser = await Users.findOne({
        where: { email: email }
    });
    if (existingUser) return res.status(400).json({ msg: "Email is already registered" });

    const salt = bcrypt.genSaltSync(10); 
    const hashPassword = bcrypt.hashSync(password, salt); 

    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({ msg: "Successfully Registered" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Login
export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: { email: req.body.email }
        });

        if (user.length === 0) return res.status(404).json({ msg: "Email not found. Please check your email address or register a new account." });

        const match = bcrypt.compareSync(req.body.password, user[0].password); 
        if (!match) return res.status(400).json({ msg: "Wrong Password" });

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;

        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '7d' // expired refresh token
        });

        await Users.update({ refresh_token: refreshToken }, {
            where: { id: userId }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Logout
export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await Users.findAll({
        where: { refresh_token: refreshToken }
    });

    if (!user[0]) return res.sendStatus(204);

    const userId = user[0].id;

    await Users.update({ refresh_token: null }, {
        where: { id: userId }
    });

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
};
