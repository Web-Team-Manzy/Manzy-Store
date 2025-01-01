const categoryM = require("../models/categoryM");

class categoryC{
    // Admin Features
    async addCategory(req, res) {
        try {

            const {name, description, subcategories} = req.body;

            console.log(req.body);

            const category = new categoryM({name, description, subcategories});

            await category.save();
            res.json({success: true, message: "Add category successfully"});

        } catch (error) {

            console.log(error);
            res.json({success: false, message: error.message});

        }
    }

    async updateCategory(req, res) {
        try {
            
            const {categoryId, name, description, subcategories} = req.body;

            await categoryM.findByIdAndUpdate(categoryId, {name, description, subcategories});

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

    async deleteCategory(req, res) {
        try {
            const {categoryId} = req.params;
            const category = await categoryM.findByIdAndDelete(categoryId);

            if (!category) {
                return res.json({success: false, message: "Category not found"});
            }

            res.json({success: true, message: "Delete category successfully"});
        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }
    }
}

module.exports = new categoryC;