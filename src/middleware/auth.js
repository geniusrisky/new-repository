const jwt = require("jsonwebtoken");
const BlogsModel = require("../models/BlogsModel");


const isValid = function (x) {
    if (typeof x === "undefined" || x === null) return false;
    if (typeof x === "string" && x.trim().length === 0) return false;
    return true;
};

// for authentication
const validateToken = function (req, res, next) {
    let token = req.headers["x-api-key"]
    if (!token) {
        return res.status(401).send({ status: false, error: "token must be present" })
    }

    console.log(token);
    let decodeToken = jwt.verify(token, "Akash123")
    if (!decodeToken) {
        res.status(401).send("status:false , error:invalid token")
    }
    req.decodedAuthorId = decodeToken

    next();
}

//for authorisation

const authorisation = async function (req, res, next) {

    try {
        let decodeToken = req.decodedAuthorId
        let authorLoggedId = decodeToken.authorId

        let blogId = req.params.blogId
        // validation of blogId

        if (!ObjectId.isValid(blogId)) return res.status(400).send({ status: false, msg: "Not a valid blog ID" })


        let getAuthorId = await BlogsModel.findById(blogId)
        let authorToupdate = getAuthorId.authorId
        if (authorToupdate != authorLoggedId) {
            return res.status(403).send({ status: false, author: "unauthorised" })

        }

        next();

    }
    catch (error) {
        console.log("error:", error.message)
        res.status(500).send({ error: error.message })
    }

}



const delQueryAuth = function (req, res, next) {

    try {
        let decodeToken = req.decodedAuthorId
        let authorLoggedId = decodeToken.authorId
        console.log(decodeToken)

        let authorId = req.query.authorId

        //validation of authorId
        if (authorId) {
            if (!ObjectId.isValid(authorId)) return res.status(400).send({ status: false, msg: "Not a valid author ID from Token" })

            if ((authorId != authorLoggedId))
                return res.status(403).send({ status: false, error: "Unauthorized" })
        }
         
            authorId = authorLoggedId;
            req.query.authorId = authorId;

        
        next();
    }
    catch (error) {
        console.log("error:", error.message)
        res.status(500).send({ error: error.message })
    }

}



module.exports.validateToken = validateToken
module.exports.authorisation = authorisation
module.exports.delQueryAuth = delQueryAuth