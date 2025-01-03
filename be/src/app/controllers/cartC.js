const userM = require("../models/userM");
const productM = require("../models/productM");

class cartC {
  constructor() {
    this.getUserCart = this.getUserCart.bind(this);
  }
  // Hàm hợp nhất hai giỏ hàng
  mergeCarts(cart1, cart2) {
    for (const itemId in cart2) {
      if (cart1[itemId]) {
        for (const size in cart2[itemId]) {
          if (cart1[itemId][size]) {
            cart1[itemId][size] += cart2[itemId][size];
          } else {
            cart1[itemId][size] = cart2[itemId][size];
          }
        }
      } else {
        cart1[itemId] = cart2[itemId];
      }
    }
    return cart1;
  }

  async getUserCart(req, res) {
    try {
      const userId = req.user ? req.user.id : null;

      let cartData = {};

      if (userId) {
        const userData = await userM.findById(userId);
        cartData = userData.cartData || {};

        // Hợp nhất giỏ hàng trong session nếu có
        if (req.session.cartData) {
          cartData = this.mergeCarts(cartData, req.session.cartData);
          req.session.cartData = null;
          await userM.findByIdAndUpdate(userId, { cartData: cartData });
        }
      } else {
        cartData = req.session.cartData || {};
      }

      const detailedCartData = await Promise.all(
        Object.keys(cartData).map(async (itemId) => {
          const product = await productM.findById(itemId);
          const sizes = cartData[itemId];
          return {
            product,
            sizes,
          };
        })
      );

      res.json({ success: true, cartData: detailedCartData });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }

  async addToCart(req, res) {
    try {
      const userId = req.user ? req.user.id : null;
      const { itemId, size } = req.body;

      let cartData = {};

      if (userId) {
        const userData = await userM.findById(userId);
        cartData = userData.cartData || {};
      } else {
        cartData = req.session.cartData || {};
      }

      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        } else {
          cartData[itemId][size] = 1;
        }
      } else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
      }

      if (userId) {
        await userM.findByIdAndUpdate(userId, { cartData: cartData });
      } else {
        req.session.cartData = cartData;
      }

      res.json({ success: true, message: "Thêm vào giỏ hàng thành công" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const userId = req.user ? req.user.id : null;
      const { itemId, size, quantity } = req.body;

      let cartData = {};

      if (userId) {
        const userData = await userM.findById(userId);
        cartData = userData.cartData || {};
      } else {
        cartData = req.session.cartData || {};
      }

      if (quantity === 0) {
        if (cartData[itemId] && cartData[itemId][size] !== undefined) {
          delete cartData[itemId][size];

          if (Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId];
          }
        } else {
          return res.json({
            success: false,
            message: "Sản phẩm hoặc kích thước không tồn tại trong giỏ hàng",
          });
        }
      } else {
        if (cartData[itemId] && cartData[itemId][size] !== undefined) {
          cartData[itemId][size] = quantity;
        } else {
          return res.json({
            success: false,
            message: "Sản phẩm hoặc kích thước không tồn tại trong giỏ hàng",
          });
        }
      }

      if (userId) {
        await userM.findByIdAndUpdate(userId, { cartData: cartData });
      } else {
        req.session.cartData = cartData;
      }

      res.json({ success: true, message: "Cập nhật giỏ hàng thành công" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }
}

module.exports = new cartC();
