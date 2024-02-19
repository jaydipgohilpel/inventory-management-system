const orderModel = require("../model/Order");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

// Handle order creation
async function handleCreate(req, res) {
  try {
    // Check if all required data is provided
    if (req.body.order_date && req.body.customer_id && req.body.status && req.body.order_detail) {
      const newOrder = new orderModel(req.body);
      let result = await newOrder.save();
      result = result.toObject();
      return apiResponse.successResponseWithData(res, "Order created successfully.", result);
    } else {
      return apiResponse.validationErrorWithData(res, "Not all data provided. Please provide necessary data.", "Invalid Data");
    }
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle order deletion
async function handleDelete(req, res) {
  try {
    if (req.params.id) {
      const result = await orderModel.deleteOne({ _id: req.params.id });

      if (!result.deletedCount)
        return apiResponse.validationErrorWithData(res, "Order not found or Error occurred while deleting Order.", { success: false });
      return apiResponse.successResponseWithData(res, "Order deleted successfully.", result);
    } else
      return apiResponse.validationErrorWithData(res, "Order ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle order update
async function handleUpdate(req, res) {
  try {
    if (req.params.id) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      req.body.updated_at = new Date();
      const result = await orderModel.updateOne(
        { '_id': objectId },
        { $set: req.body }
      );
      if (result.modifiedCount) return apiResponse.successResponseWithData(res, "Order Update Success.", result);
      else return apiResponse.validationErrorWithData(res, "Order not found or Error occurred while updating Order.", { success: false });
    } else
      return apiResponse.validationErrorWithData(res, "Order ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle fetching list of orders
async function handleGetList(req, res) {
  try {
    let orders = await orderModel.find({}).sort({ created_at: -1 })
      .populate('customer_id', 'customer_name');

    const modifiedOrders = orders.map(order => {
      const { customer_id, ...rest } = order._doc;
      return {
        ...rest,
        customer_name: order.customer_id?.customer_name,
        customer_id: order.customer_id?._id,
      };
    });

    apiResponse.successResponseWithData(res, "Fetch Order Success.", modifiedOrders);
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

module.exports = {
  handleCreate,
  handleDelete,
  handleUpdate,
  handleGetList
};
