const authorModel = require("../models/AuthorModel")

const jwt = require("jsonwebtoken")


const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{6,15}$/;
const isValid = function (x) {
    if (typeof x === "undefined" || x === null) return false;
    if (typeof x === "string" && x.trim().length === 0) return false;
    return true;
};
const isValidTitle = function (x) {
    return ["Mr", "Mrs", "Miss"].indexOf(x) !== -1;
};
const isValidBody = function (x) {
    return Object.keys(x).length > 0;
};







// const isValidbody = function(a){
//     return Object.keys(a).length >
// }



const authors = async function (req, res) {
    try {

        let requestBody = req.body;
        const { title, fname, lname, email, password } = requestBody

        if (!isValidBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "Invalid Request Parameter, Please Provide Another Details", });
        }
        if (!isValid(email)) return res.status(400).send({ status: false, msg: "email is required." })

        if (!isValid(password)) return res.status(400).send({ status: false, msg: "Password is required." })

        if (!(emailRegex.test(email))) {
            return res.status(400).send({ status: false, msg: "Email Should Be Valid Email Address" })
        }
        if (!(passwordRegex.test(password))) return res.status(400).send({ status: false, msg: "Passsword should be valid " })


        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Title is Required" })
        }



        if (!isValidTitle(title)) {

            return res.status(400).send({ status: false, msg: " Invalid Title" })
        }

        if (!isValid(fname)) {
            return res.status(400).send({ status: false, msg: "First Name is Required" })
        }

        if (!isValid(lname)) {
            return res.status(400).send({ status: false, msg: "Last Name is Required" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Email is Required" })
        }
        if (!(emailRegex.test(email))) {
            return res.status(400).send({ status: false, msg: "Email Should Be Valid Email Address" })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "Password is Required" })
        }
        const isEmailIdUnique = await authorModel.findOne({ email })
        if (isEmailIdUnique) {
            return res.status(400).send({ status: false, msg: `${email} Email is Already Present` })
        }

        let createAuthor = await authorModel.create(requestBody)
        res.status(201).send({ authorCreated: createAuthor })
    }
    catch (error) {
        console.log("error:", error.message)
        res.status(500).send({ error: error.message })
    }


}












//author login


const loginAuthor = async function (req, res) {
    try {
        let credentials = req.body
        const { email, password } = credentials

        if (!email || !password) return res.status(422).send({ status: false, msg: "All fields are required" });


        if (!isValid(email)) return res.status(400).send({ status: false, msg: "email is required." })

        if (!isValid(password)) return res.status(400).send({ status: false, msg: "Password is required." })

        if (!(emailRegex.test(email))) {
            return res.status(400).send({ status: false, msg: "Email Should Be Valid Email Address" })
        }
        if (!(passwordRegex.test(password))) return res.status(400).send({ status: false, msg: "Passswoor should be valid " })

        let validateAuthor = await authorModel.findOne({ email: email, password: password })



        if (!validateAuthor)
            return res.status(400).send({ staus: false, error: "Bad request" })


        let token = jwt.sign(
            {
                authorId: validateAuthor._id.toString()
            },
            "Akash123"
        );
        res.status(201).send({ status: true, token: token })
    }
    catch (error) {
        console.log("error:", error.message)
        res.status(500).send({ error: error.message })
    }
}

module.exports.authors = authors
module.exports.loginAuthor = loginAuthor