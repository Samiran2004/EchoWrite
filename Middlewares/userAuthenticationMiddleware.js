import JWT from 'jsonwebtoken';
import User from '../Models/userModel.js';

function validateUserToken(token) {
    return async (req, res, next) => {
        const tokenValue = req.cookies[token];
        if (!tokenValue) {
            res.render('loginPage');
        } else {
            try {
                const userPayload = JWT.verify(tokenValue, process.env.JWT_SECRET);
                const checkUser = await User.findById(userPayload._id);
                if (checkUser) {
                    req.user = userPayload;
                    res.locals.user = userPayload;
                    return next();
                } else {
                    res.render('loginPage');
                }
            } catch (error) {
                res.render('loginPage');
            }
        }
    }
}

export default validateUserToken;