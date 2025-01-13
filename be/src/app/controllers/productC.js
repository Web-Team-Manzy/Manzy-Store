const productM = require("../models/productM");
const categoryM = require("../models/categoryM");
const cloudinary = require("../../config/cloud/clConfig");
const orderM = require("../models/orderM");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

class productC {
    async addProduct(req, res) {
        try {
            const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

            // Kiểm tra đầu vào
            if (!name || !description || !price || !category || !sizes) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            const image1 = req.files.image1 && req.files.image1[0];
            const image2 = req.files.image2 && req.files.image2[0];
            const image3 = req.files.image3 && req.files.image3[0];
            const image4 = req.files.image4 && req.files.image4[0];

            const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

            let imagesUrl = await Promise.all(
                images.map(async (pathitem) => {
                    let result = await cloudinary.uploader.upload(pathitem.path, {
                        resource_type: "image",
                    });
                    return result.secure_url;
                })
            );

            const subcategory = subCategory;

            let parseSizes = JSON.parse(sizes);
            let sortedSizes = [];

            if (parseSizes.length > 0) {
                if (typeof parseSizes[0] === "string") {
                    sortedSizes = parseSizes.sort((a, b) => a.localeCompare(b));
                } else if (typeof parseSizes[0] === "number") {
                    sortedSizes = parseSizes.sort((a, b) => a - b);
                }
            }

            const productData = {
                name,
                description,
                price: Number(price),
                category,
                subcategory,
                sizes: sortedSizes,
                bestseller: bestseller === "true" ? true : false,
                images: imagesUrl,
            };

            const product = new productM(productData);
            await product.save();

            res.json({ success: true, message: "Add product successfully" });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    // Hiện danh sách sản phẩm cho admin and user
    async listProduct(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                category,
                subCategory,
                sortField,
                sortOrder = "asc",
                search,
                bestseller,
            } = req.query;

            let query = {};
            if (category && category !== "null" && category !== "undefined") {
                const categoryDoc = await categoryM.findOne({ _id: category });
                if (categoryDoc) query.category = categoryDoc._id;
            }

            if (subCategory) {
                query.subcategory = subCategory;
            }

            if (search) {
                query.name = { $regex: search, $options: "i" };
            }

            if (bestseller) {
                query.bestseller = true;
            }

            const sortOption = {};
            if (sortField && sortOrder) {
                sortOption[sortField] = sortOrder === "asc" ? 1 : -1;
            }

            const total = await productM.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            const products = await productM
                .find(query)
                .populate("category", "name")
                .sort(sortOption)
                .skip((page - 1) * parseInt(limit))
                .limit(parseInt(limit));

            res.json({
                success: true,
                search: search || "",
                category: category || "",
                subCategory: subCategory || "",
                currentPage: parseInt(page),
                totalPages,
                sortField: sortField || null,
                sortOrder: sortOrder || null,
                bestseller: bestseller || false,
                products,
            });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    // Hiện tên category và subcategory
    async detailProduct(req, res) {
        try {
            const { productId } = req.params;
            console.log(productId);
            const product = await productM.findById(productId);
            res.json({ success: true, product });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const {
                productId,
                name,
                description,
                price,
                category,
                subCategory,
                sizes,
                bestseller,
            } = req.body;
            console.log(">>>>> req.body ", req.body);
            const currentProduct = await productM.findById(productId);
            if (!currentProduct) {
                return res.json({ success: false, message: "Product not found" });
            }

            const image1 = req.files?.image1?.[0];
            const image2 = req.files?.image2?.[0];
            const image3 = req.files?.image3?.[0];
            const image4 = req.files?.image4?.[0];

            console.log("image1: ", image1);
            console.log("image2: ", image2);
            console.log("image3: ", image3);
            console.log("image4: ", image4);

            const subcategory = subCategory;

            let parseSizes = JSON.parse(sizes);
            let sortedSizes = [];

            if (parseSizes.length > 0) {
                if (typeof parseSizes[0] === "string") {
                    sortedSizes = parseSizes.sort((a, b) => a.localeCompare(b));
                } else if (typeof parseSizes[0] === "number") {
                    sortedSizes = parseSizes.sort((a, b) => a - b);
                }
            }

            // Thay vì ghi đè toàn bộ, chỉ cập nhật ảnh đã upload mới
            let imagesUrl = [...currentProduct.images];
            if (image1) {
                const result = await cloudinary.uploader.upload(image1.path, {
                    resource_type: "image",
                });
                imagesUrl[0] = result.secure_url;
            }
            if (image2) {
                const result = await cloudinary.uploader.upload(image2.path, {
                    resource_type: "image",
                });
                imagesUrl[1] = result.secure_url;
            }
            if (image3) {
                const result = await cloudinary.uploader.upload(image3.path, {
                    resource_type: "image",
                });
                imagesUrl[2] = result.secure_url;
            }
            if (image4) {
                const result = await cloudinary.uploader.upload(image4.path, {
                    resource_type: "image",
                });
                imagesUrl[3] = result.secure_url;
            }

            console.log("imagesUrl: ", imagesUrl);

            const updateData = {
                name,
                description,
                price: Number(price),
                category,
                subcategory,
                sizes: sortedSizes,
                bestseller: bestseller === "true",
                images: imagesUrl,
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
            const product = await productM.findById(req.query.id);
            if (!product) {
                return res.json({ success: false, message: "Product not found" });
            }

            const images = product.images;
            if (images && images.length > 0) {
                const cloudinary = require("cloudinary").v2;
                for (const imageUrl of images) {
                    const publicId = imageUrl.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            await productM.findByIdAndDelete(req.query.id);
            res.json({
                success: true,
                message: "Delete product and images successfully",
            });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    // Hiện sản phẩm bán chạy nhất update bestseller
    async updateBestSeller(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const orders = await orderM
                .find({
                    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
                })
                .lean();

            const productSales = orders.reduce((total, order) => {
                order.items.forEach((item) => {
                    const productId = item.product._id;
                    const productQuantity = Object.values(item.sizes).reduce(
                        (sum, qty) => sum + qty,
                        0
                    );

                    if (!total[productId]) {
                        total[productId] = productQuantity;
                    } else {
                        total[productId] += productQuantity;
                    }
                });
                return total;
            }, {});

            const bestSellingProducts = Object.entries(productSales)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([productId]) => productId);

            await productM.updateMany({}, { $set: { bestseller: false } });

            const bestSellingProductsObjectIds = bestSellingProducts;

            for (const productId of bestSellingProductsObjectIds) {
                await productM.findByIdAndUpdate(productId, { bestseller: true });
            }

            await productM.find({ bestseller: true });

            res.json({
                success: true,
                message: "Bestseller list updated successfully",
            });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    async listBestSeller(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            const total = await productM.countDocuments({ bestseller: true });
            const products = await productM
                .find({ bestseller: true })
                .skip(parseInt(skip))
                .limit(parseInt(limit));
            res.json({
                success: true,
                products,
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
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

    async getRelatedProducts(req, res) {
        try {
            const { productId } = req.params;

            // Kiểm tra productId có được cung cấp
            if (!productId) {
                return res.status(400).json({ success: false, message: "Thiếu productId" });
            }

            // Tìm sản phẩm chính
            const product = await productM.findById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
            }

            const categoryId = product.category;

            const relatedProducts = await productM
                .find({
                    category: categoryId,
                    _id: { $ne: productId },
                })
                .limit(10);

            res.json({ success: true, relatedProducts });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new productC();
