//Login user...
async function loginUser(req, res, next) {
    console.log(req.body);
    res.status(200).send({
        message: "Login successful",
    });
}

//Signin a new user...
async function signin(req, res, next) {
    const {name, email, password} = req.body;
    console.log(name)
    console.log(email)
    console.log(password);
}

module.exports = {
    loginUser,
    signin
}