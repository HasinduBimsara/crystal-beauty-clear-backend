import Order from "../models/orders.js";

export function createOrder(req, res) {
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
    .then((lastBills) => {
      if (lastBills.length == 0) {
        orderData.orderId = "ORD001";
      } else {
        const lastBill = lastBills[0];
        const lastOrderId = lastBill.orderId;
        const lastOrderNumber = lastOrderId.replace("ORD", "");
        const lastOrderNumberInt = parseInt(lastOrderNumber);
        const newOrderNumberInt = lastOrderNumberInt + 1;
        const newOrderNumberStr = newOrderNumberInt.toString().padStart(4, "0");
        orderData.orderId = "ORd" + newOrderNumberStr;
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
