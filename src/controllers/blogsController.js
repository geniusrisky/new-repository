const AuthorModel = require("../models/AuthorModel")
const blogsModel = require("../models/BlogsModel")
const ObjectId = require("mongoose").Types.ObjectId









const isValid = function (x) {
    if (typeof x === "undefined" || x === null) return false;
    if (typeof x === "string" && x.trim().length === 0) return false;
    return true;
};

const isValidBody = function (x) {
    return Object.keys(x).length > 0;
};

const isValidRequest = function (request) {
    return (Object.keys(request).length > 0)
}




//blogs creation
const blogs = async function (req, res) {
    try {
        let data = req.body

        const { title, body, authorId, category, subcategory, tags } = data

        if (!isValidBody(data)) {
            return res.status(400).send({ status: false, msg: "Invalid Request Parameter, Please Provide Another Details", });
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Title is Required" })
        }

        if (!isValid(body)) {
            return res.status(400).send({ status: false, msg: "Body is Required" })
        }

        if (!isValid(authorId)) {
            return res.status(400).send({ status: false, msg: "AuthorId is Required" })
        }


        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "Category is Required" })
        }
        if (tags) {
            if (Array.isArray(tags)) {
                data['tags'] = [...tags]
            }
        }
        if (subcategory) {
            if (Array.isArray(subcategory)) {
                data['subcategory'] = [...subcategory]
            }
        }



        //checking Id format
        if (!ObjectId.isValid(authorId)) return res.status(400).send({ status: false, msg: "Not a valid author ID" })

        let findAuthorId = await AuthorModel.findById(authorId)
        if (!findAuthorId) return res.status(404).send({ status: false, error: "Author Not found. Please enter a valid Author id." })

        //if above all acses passed then finally our data will be created

        const blogBody = { title, body, authorId, category,tags,subcategory }

        if (data.isPublished === true) {
            let blogData = await blogsModel.create(blogBody);
            blogData.publishedAt = new Date();
            return res.status(201).send({ status: true, msg: blogBody });
        }
        else {
            let blogData = await blogsModel.create(blogData);
            return res.status(201).send({ status: true, msg: blogBody });
        }

    }

    catch (error) {
        console.log("error:", error.message)
        res.status(500).send({ error: error.message })
    }
}







//for get api 
// --->fetching blogs

const getBlogs = async function (req, res) {

    try {
        let query = req.query

        //let authorId= req.query.authorId

        let { authorId, category, subcategory, tags } = query

        let filterdata = { isDeleted: false, isPublished: true }

        if (authorId) {
            if (ObjectId.isValid(authorId)) {
                filterdata.authorId = authorId
            }
        }
        if (isValid(category)) {
            filterdata.category = category.trim()
        }
        if (isValid(subcategory)) {
            filterdata.subcategory = subcategory.trim().split(",").map(x => x.trim())
        }
        if (isValid(tags)) {
            filterdata.tags = tags.trim(",").split(",").map(x => x.trim())
        }

        console.log("filterdata :", filterdata)

        let findDetails = await blogsModel.find(filterdata)
        if (findDetails.length == 0) {
            return res.status(404).send({ msg: "no user matches this category" })

        }

        res.status(200).send({ authorDetails: findDetails })

    }
    catch (error) {
        console.log("error:", error.message)
        res.status(500).send({ error: error.message })
    }

}










//put blog

const putBlogs = async function (req, res) {
    //to check blog exist or not if isdeleted-->flase means it exists else not 



    try {
        id = req.params.blogId
        let requestbody = req.body
        let { title, body, tags, subcategory } = requestbody;
        let filter = { _id: id, isDeleted: false }

        if (!ObjectId.isValid(id)) {
            res.status(404).send({ status: false, error: " BAD REQUEST" })
        }
        if (tags) {
            if (Array.isArray(tags)) {
                requestbody['tags'] = [...tags]
            }}

        let blogExist = await blogsModel.findOneAndUpdate(filter,
            {
                $push: { tags: tags, subcategory: subcategory },
                $set: { title: title, body: body, isPublished: true, publishedAt: new Date() },
            }, { new: true })
         console.log(blogExist)

        if (!blogExist) {
            return res.status(400).send({ status: false, error: "blog not exist" }) 
        }
            res.status(200).send({ status: true, update: blogExist })
           
    }


    catch (error) {
        console.log("error:", error.message)
        res.status(500).send({ error: error.message })
    }
}











//delete blogs

const deleteBlog = async function (req, res) {

    try {
        let id = req.params.blogId

        if (!ObjectId.isValid(id)) {
            res.status(404).send({ status: false, error: " BAD REQUEST" })
        }

        let existId = await blogsModel.updateMany({ _id: id, isDeleted: false }, { $set: { isDeleted: true ,deletedAt: new Date()} }, { new: true })
        if (!existId) {
            return res.status(404).send({ msg: "blog not available" })
        }
        res.status(200).send({ status: true, existId: existId })


    }
    catch (error) {
        console.log("error:", error.message)
        res.status(500).send({ error: error.message })
    }


}










// deletion by filtering

let blogDeletionQuery = async function (req, res) {

    try {
        let query = req.query

        let filter = { isdeleted: false }

        if (!isValidRequest(query)) return res.status(400).send({ status: false, message: "No query by user." })
        const { category, authorId, tags, subcategory, isPublished } = query

        if (authorId) {
            if (!ObjectId.isValid(authorId)) {
                return res.send({ status: false, msg: "not valid id" })
            }
            if (ObjectId.isValid(authorId)) {
                filter['authorId'] = authorId
            }
        }
        if (isValid(category)) {
            filter['category'] = category.trim()
        }
        if (isValid(tags)) {
            const tagsArr = tags.trim().split(',').map(x => x.trim())
            filter['tags'] = { $all: tagsArr }
        }
        if (isValid(subcategory)) {
            const subcatArr = subcategory.trim().split(',').map(x => x.trim())
            filter['subcategory'] = { $all: subcatArr }
        }
        if (isValid(isPublished)) {
            if (typeof isPublished !== 'boolean') { return res.status(400).send({ status: false, error: "not published" }) }

        }



        //console.log(query, query.tags.length)
        let dataToDelete = await blogsModel.updateMany(filter,
            { $set: { isDeleted: true ,deletedAt: new Date()} },
            { new: true })

        if (!dataToDelete) {
            return res.status(404).send({ status: false, msg: "blog do not exist" })
        }
        console.log(dataToDelete)

        res.status(200).send({ status: false, msg: dataToDelete })

    }
    catch (error) {
        console.log("error:", error.message)
        res.status(500).send({ error: error.message })
    }

}












module.exports.blogs = blogs
module.exports.putBlogs = putBlogs
module.exports.getBlogs = getBlogs
module.exports.deleteBlog = deleteBlog
module.exports.blogDeletionQuery = blogDeletionQuery