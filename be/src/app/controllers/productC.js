const productM = require("../models/productM");
const categoryM = require("../models/categoryM");
const cloudinary = require("../../config/cloud/clConfig");

class productC {
  async addProduct(req, res) {
    try {
      const {
        name,
        description,
        price,
        category,
        subCategory,
        sizes,
        bestseller,
      } = req.body;

      const image1 = req.files.image1 && req.files.image1[0];
      const image2 = req.files.image2 && req.files.image2[0];
      const image3 = req.files.image3 && req.files.image3[0];
      const image4 = req.files.image4 && req.files.image4[0];

      const images = [image1, image2, image3, image4].filter(
        (item) => item !== undefined
      );

      let imagesUrl = await Promise.all(
        images.map(async (pathitem) => {
          let result = await cloudinary.uploader.upload(pathitem.path, {
            resource_type: "image",
          });
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
  //
  async listProduct(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        sortField,
        sortOrder = "asc",
        search,
        bestseller,
      } = req.query;

      let query = {};
      if (category) {
        const categoryDoc = await categoryM.findOne({ name: category });
        if (categoryDoc) query.category = categoryDoc._id;
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
        .populate("subCategory", "name")
        .sort(sortOption)
        .skip((page - 1) * parseInt(limit))
        .limit(parseInt(limit));

      res.json({
        success: true,
        search: search || "",
        category: category || "",
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
      const currentProduct = await productM.findById(productId);
      if (!currentProduct) {
        return res.json({ success: false, message: "Product not found" });
      }

      const image1 = req.files?.image1?.[0];
      const image2 = req.files?.image2?.[0];
      const image3 = req.files?.image3?.[0];
      const image4 = req.files?.image4?.[0];

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

      const updateData = {
        name,
        description,
        price: Number(price),
        category,
        subCategory,
        sizes: typeof sizes === "string" ? JSON.parse(sizes) : sizes,
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
      await productM.findByIdAndDelete(req.query.id);
      res.json({ success: true, message: "Delete product successfully" });
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
}

module.exports = new productC();
