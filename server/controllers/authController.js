import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err)
                return res.status(500).json(err);

            if (result.length === 0)
                return res.status(401).json({
                    message: "Invalid Email"
                });

            const user = result[0];

            const match = await bcrypt.compare(
                password,
                user.password
            );

            if (!match)
                return res.status(401).json({
                    message: "Wrong Password"
                });

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            res.json({
                success: true,
                token,
                user
            });

        }
    );

};