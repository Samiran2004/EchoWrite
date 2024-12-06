// const Support = require('../Models/customerSupportModel');
import Support from '../Models/customerSupportModel.js';

const customerSupport = async (req, res) => {
    const { username, email, message } = req.body;

    try {
        if (!username || !email || !message) {
            return res.render('errorPage', { errorMessage: "Required Fields are Missing", backUrl: '/' });
        }

        // Find the existing document by email
        let support = await Support.findOne({ email: email });

        if (support) {
            // If the document exists, update it
            support.problems.push(message);
        } else {
            // If the document does not exist, create a new one
            support = new Support({ username, email, problems: [message] });
        }

        // Save the document (either updated or new)
        await support.save();

        // Send a response indicating success
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.render('errorPage', { errorMessage: "Internal Server Error", backUrl: '/' });
    }
};

export default customerSupport;