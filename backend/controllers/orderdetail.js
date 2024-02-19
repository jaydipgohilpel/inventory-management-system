const orderDetailModel = require("../model/OrderDetail");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

// Handle order detail creation
async function handleCreate(req, res) {
  try {
    // Check if all required data is provided
    if (req.body.order_id && req.body.product_id && req.body.quantity_ordered && req.body.unit_price && req.body.total_price) {
      const newOrderDetail = new orderDetailModel(req.body);
      let result = await newOrderDetail.save();
      result = result.toObject();
      return apiResponse.successResponseWithData(res, "Order Detail created successfully.", result);
    } else {
      return apiResponse.validationErrorWithData(res, "Not all data provided. Please provide necessary data.", "Invalid Data");
    }
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle order detail deletion
async function handleDelete(req, res) {
  try {
    if (req.params.id) {
      const result = await orderDetailModel.deleteOne({ _id: req.params.id });

      if (!result.deletedCount)
        return apiResponse.validationErrorWithData(res, "Order Detail not found or Error occurred while deleting Order Detail.", { success: false });
      return apiResponse.successResponseWithData(res, "Order Detail deleted successfully.", result);
    } else
      return apiResponse.validationErrorWithData(res, "Order Detail ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle order detail update
async function handleUpdate(req, res) {
  try {
    if (req.params.id) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      req.body.updated_at = new Date();
      const result = await orderDetailModel.updateOne(
        { '_id': objectId },
        { $set: req.body }
      );
      if (result.modifiedCount) return apiResponse.successResponseWithData(res, "Order Detail Update Success.", result);
      else return apiResponse.validationErrorWithData(res, "Order Detail not found or Error occurred while updating Order Detail.", { success: false });
    } else
      return apiResponse.validationErrorWithData(res, "Order Detail ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle fetching list of order details
async function handleGetList(req, res) {
  try {
    let orderDetails = await orderDetailModel.find({}).sort({ created_at: -1 })
      .populate('order_id', 'order_date')
      .populate('product_id', 'product_name');

    const modifiedOrderDetails = orderDetails.map(orderDetail => {
      const { order_id, product_id, ...rest } = orderDetail._doc;
      return {
        ...rest,
        order_date: orderDetail.order_id?.order_date,
        product_name: orderDetail.product_id?.product_name,
        order_id: orderDetail.order_id?._id,
        product_id: orderDetail.product_id?._id,
      };
    });

    apiResponse.successResponseWithData(res, "Fetch Order Detail Success.", modifiedOrderDetails);
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
