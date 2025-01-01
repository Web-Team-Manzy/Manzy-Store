const userM = require("../models/userM");
const productM = require("../models/productM");

class cartC {
  async getUserCart(req, res) {
    try {
      const userId = req.user.id;

      const userData = await userM.findById(userId);
      let cartData = await userData.cartData;

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
      const userId = req.user.id;
      const { itemId, size } = req.body;
      console.log(itemId);
      console.log(size);

      const userData = await userM.findById(userId);
      let cartData = await userData.cartData;

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

      await userM.findByIdAndUpdate(userId, { cartData: cartData });

      res.json({ success: true, message: "Add to cart successfully" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const userId = req.user.id;

      const { itemId, size, quantity } = req.body;

      const userData = await userM.findById(userId);
      let cartData = await userData.cartData;

      cartData[itemId][size] = quantity;

      await userM.findByIdAndUpdate(userId, { cartData: cartData });

      res.json({ success: true, message: "Update cart successfully" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }

  async deleteFromCart(req, res) {
    try {
      const userId = req.user.id;

      const { itemId, size } = req.body;
      console.log(itemId);
      console.log(size);

      const userData = await userM.findById(userId);
      let cartData = await userData.cartData;

      delete cartData[itemId][size];

      await userM.findByIdAndUpdate(userId, { cartData: cartData });

      res.json({ success: true, message: "Delete from cart successfully" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }
}

module.exports = new cartC();
