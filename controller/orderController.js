import Order from "../models/orders.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "Unauthorized user",
    });

    return;
  }
  const body = req.body;
  const orderData = {
    orderId: "",
    email: req.user.email,
    name: body.name,
    address: body.address,
    phoneNumber: body.phoneNumber,
    billItems: [],
    total: 0,
  };

  Order.find()
    .sort({
      date: -1,
    })
    .limit(1)
    .then(async (lastBills) => {
      if (lastBills.length == 0) {
        orderData.orderId = "ORD001";
      } else {
        const lastBill = lastBills[0];
        const lastOrderId = lastBill.orderId;
        const lastOrderNumber = lastOrderId.replace("ORD", "");
        const lastOrderNumberInt = parseInt(lastOrderNumber);
        const newOrderNumberInt = lastOrderNumberInt + 1;
        const newOrderNumberStr = newOrderNumberInt.toString().padStart(4, "0");
        orderData.orderId = "ORD" + newOrderNumberStr;
      }
      for (let i = 0; i < body.billItems.length; i++) {
        const product = await Product.findOne({
          productId: body.billItems[i].productId,
        });
        if (product == null) {
          res.status(404).json({
            message:
              "Product with product id " +
              body.billItems[i].productId +
              "not found",
          });
          return;
        }
        orderData.billItems[i] = {
          productId: product.productId,
          productName: product.name,
          image: product.images[0],
          quantity: body.billItems[i].quantity,
          price: product.price,
        };
        orderData.total =
          orderData.total + product.price * body.billItems[i].quantity;
      }

      const order = new Order(orderData);
      order
        .save()
        .then(() => {
          res.json({
            message: "Order Created",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status({
            message: "order not saved",
          });
        });
    });
}
export function getOrders(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "unauthorized user",
    });
    return;
  }

  if (req.user.admin) {
    Order.find()
      .then((orders) => {
        res.json(orders);
      })
      .catch((err) => {
        res.status(500).json({
          message: "Orders not found",
        });
      });
  } else {
    Order.find({ email: req.user.email })
      .then((orders) => {
        res.json(orders);
      })
      .catch((err) => {
        res.status(500).json({
          message: "Orders not found",
        });
      });
  }
}

export function getTotal() {
  let cart = getCart();
  let total = 0;
  cart.forEach((product) => {
    total += product.price * product.quantity;
  });
  return total;
}
