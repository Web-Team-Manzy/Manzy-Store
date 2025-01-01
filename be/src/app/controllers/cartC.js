const userM = require('../models/userM'); 
const productM = require('../models/productM');

class cartC {

    async getUserCart(req, res) {
        try {
            const userId = req.user.id;
    
            const userData = await userM.findById(userId);
            let cartData = await userData.cartData;
    
            const detailedCartData = await Promise.all(Object.keys(cartData).map(async (itemId) => {
                const product = await productM.findById(itemId);
                const sizes = cartData[itemId];
                return {
                    product,
                    sizes
                };
            }));
    
            res.json({ success: true, cartData: detailedCartData });
    
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    async addToCart(req, res) {
        try {
            
            const userId = req.user.id;
            const { itemId, size} = req.body;
            
            const userData = await userM.findById(userId);
            let cartData = await userData.cartData;

            if (cartData[itemId]) {
                if (cartData[itemId][size]) {
                    cartData[itemId][size] += 1;
                }
                else {
                    cartData[itemId][size] = 1;
                }
            } else{
                cartData[itemId] = {};
                cartData[itemId][size] = 1;
            }

            await userM.findByIdAndUpdate(userId, {cartData: cartData});

            res.json({success: true, message: "Add to cart successfully"});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }
    }

    async updateCart(req, res) {
        try {
            const userId = req.user.id;
            const { itemId, size, quantity } = req.body;
            
            const userData = await userM.findById(userId);
            let cartData = userData.cartData || {};
    
            if (quantity === 0) {
                // Xóa kích thước cụ thể khỏi sản phẩm
                if (cartData[itemId] && cartData[itemId][size] !== undefined) {
                    delete cartData[itemId][size];
                    
                    // Kiểm tra nếu không còn kích thước nào, xóa sản phẩm khỏi giỏ hàng
                    if (Object.keys(cartData[itemId]).length === 0) {
                        delete cartData[itemId];
                    }
                } else {
                    return res.json({ success: false, message: "Sản phẩm hoặc kích thước không tồn tại trong giỏ hàng" });
                }
            } else {
                // Cập nhật số lượng sản phẩm
                if (cartData[itemId] && cartData[itemId][size] !== undefined) {
                    cartData[itemId][size] = quantity;
                } else {
                    return res.json({ success: false, message: "Sản phẩm hoặc kích thước không tồn tại trong giỏ hàng" });
                }
            }
    
            await userM.findByIdAndUpdate(userId, { cartData: cartData });
    
            res.json({ success: true, message: "Cập nhật giỏ hàng thành công" });
    
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }
}

module.exports = new cartC();




