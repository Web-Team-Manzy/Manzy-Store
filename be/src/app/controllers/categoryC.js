const categoryM = require("../models/categoryM");

class categoryC{
    // Admin Features
    async addCategory(req, res) {
        try {

            const {name, description, subcategories} = req.body;

            // Sort subcategories
            subcategories = subcategories.sort((a, b) => a.localeCompare(b));

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

            // Sort subcategories
            subcategories = subcategories.sort((a, b) => a.localeCompare(b));

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
            const page = parseInt(req.query.page) || 1; 
            const limit = parseInt(req.query.limit) || 5;
            const skip = (page - 1) * limit; 
    
            const data = await categoryM.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });
            const total = await categoryM.countDocuments({}); 
    
            res.json({
                success: true,
                data,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
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

    async getCategoryById(req, res) {
        try {
            const { categoryId } = req.params;
            const category = await categoryM.findById(categoryId);
            if (!category) {
                return res.json({ success: false, message: "Category not found" });
            }
            res.json({ success: true, data: category });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    async searchCategories(req, res) {
        try {
            const { name } = req.query;
            const categories = await categoryM.find({ name: new RegExp(name, 'i') });
            res.json({ success: true, data: categories });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }
}

module.exports = new categoryC;