const User = require('../Models/UserModel');

const CreateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await User.create({ username, email, password });
        const { password: _, ...safeUser } = newUser.toJSON();
        res.status(201).json(safeUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const GetAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const { password: _, ...safeUser } = user.toJSON();
        res.status(200).json(safeUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { CreateUser, GetAllUsers, LoginUser };