const productM = require('../models/productM'); 
const categoryM = require('../models/categoryM');
const cloudinary = require('../../config/cloud/clConfig');

class productC {

    async addProduct(req, res) {
        try {
            
            const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

            const image1= req.files.image1 && req.files.image1[0];
            const image2= req.files.image2 && req.files.image2[0];
            const image3= req.files.image3 && req.files.image3[0];
            const image4= req.files.image4 && req.files.image4[0];

            const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

            let imagesUrl = await Promise.all(
                images.map(async (pathitem) => {
                    let result = await cloudinary.uploader.upload(pathitem.path, {resource_type: "image"});
                    return result.secure_url;
                })
            );

            const productData = {
                name,
                description,
                price: Number(price),
                category,
                subCategory,
                sizes: JSON.parse(sizes),
                bestseller: bestseller === 'true'? true : false,
                images: imagesUrl
            };

            const product = new productM(productData);
            await product.save();

            res.json({success: true, message: "Add product successfully"});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }

    }
    // 
    async listProduct(req, res) {
        try {
            const { 
                page = 1, 
                limit = 10, 
                category, 
                sortField = 'name', 
                sortOrder = 'asc', 
                search 
            } = req.query;
    
            let query = {};
            if (category) {
                const categoryDoc = await categoryM.findOne({ name: category });
                if (categoryDoc) query.category = categoryDoc._id;
            }
    
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }
    
            const sortOption = {};
            sortOption[sortField] = sortOrder === 'asc' ? 1 : -1;
    
            const total = await productM.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            const products = await productM.find(query)
                .populate('category', 'name')
                .populate('subCategory', 'name')
                .sort(sortOption)
                .skip((page - 1) * parseInt(limit))
                .limit(parseInt(limit));
    
            res.json({
                success: true,
                search: search || '',
                category: category || '',
                currentPage: parseInt(page),
                totalPages,
                products
            });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }
    
// Hiện tên category và subcategory
    async detailProduct(req, res) {
        try {
            const {productId} = req.params;
            console.log(productId);
            const product = await productM.findById(productId);
            res.json({success: true, product});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }
    }

    async updateProduct(req, res) {
        try {
            const { productId, name, description, price, category, subCategory, sizes, bestseller } = req.body;
    
            // Lấy product hiện tại
            const currentProduct = await productM.findById(productId);
            if (!currentProduct) {
                return res.json({ success: false, message: "Product not found" });
            }
    
            // Xử lý upload ảnh nếu có
            const image1 = req.files?.image1?.[0];
            const image2 = req.files?.image2?.[0];
            const image3 = req.files?.image3?.[0];
            const image4 = req.files?.image4?.[0];
    
            const newImages = [image1, image2, image3, image4].filter(Boolean);
            let imagesUrl = currentProduct.images; // giữ ảnh cũ nếu không upload mới
    
            if (newImages.length > 0) {
                imagesUrl = await Promise.all(newImages.map(async (pathitem) => {
                    const result = await cloudinary.uploader.upload(pathitem.path, { resource_type: "image" });
                    return result.secure_url;
                }));
            }
    
            const updateData = {
                name,
                description,
                price: Number(price),
                category,
                subCategory,
                sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
                bestseller: (bestseller === 'true'),
                images: imagesUrl
            };
    
            await productM.findByIdAndUpdate(productId, updateData, { new: true });
    
            res.json({ success: true, message: "Update product successfully" });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            
            await productM.findByIdAndDelete(req.query.id);
            res.json({success: true, message: "Delete product successfully"});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }
    }
    
    async listBestSeller(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            const total = await productM.countDocuments({ bestseller: true });
            const products = await productM.find({ bestseller: true })
                .skip(parseInt(skip))
                .limit(parseInt(limit));
            res.json({
                success: true,
                products,
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    async listNewProduct(req, res) {
        try {
            const products = await productM.find().sort({ createdAt: -1 }).limit(10);
            res.json({ success: true, products });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }
}

module.exports = new productC();




