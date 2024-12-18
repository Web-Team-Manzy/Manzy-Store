const categoryM = require("../models/categoryM");

class categoryC{
    // Admin Features
    async addCategory(req, res) {
        try {

            const {name, description} = req.body;

            const category = new categoryM({name, description});

            await category.save();
            res.json({success: true, message: "Add category successfully"});

        } catch (error) {

            console.log(error);
            res.json({success: false, message: error.message});

        }
    }

    async updateCategory(req, res) {
        try {
            
            const {categoryId, name, description} = req.body;

            await categoryM.findByIdAndUpdate(categoryId, {name, description});

            res.json({success: true, message: "Update category successfully"});

        } catch (error) {   

            console.log(error);
            res.json({success: false, message: error.message});
            
        }
    }

    // User Features
    async listCategory(req, res) {
        try {

            const data = await categoryM.find({});
            res.json({success: true, data});

        } catch (error) {

            console.log(error);
            res.json({success: false, message: error.message});

        }
    }
}

module.exports = new categoryC;