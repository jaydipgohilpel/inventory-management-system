const warehouseModel = require("../model/Warehouse");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

// Handle warehouse creation
async function handleCreate(req, res) {
  try {
    if (req.body.warehouse_name && req.body.location) {
      const newWarehouse = new warehouseModel(req.body);
      let result = await newWarehouse.save();
      result = result.toObject();
      return apiResponse.successResponseWithData(res, "Warehouse created successfully.", result);
    } else {
      return apiResponse.validationErrorWithData(res, "Not all data provided. Please provide necessary data.", "Invalid Data");
    }
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle warehouse deletion
async function handleDelete(req, res) {
  try {
    if (req.params.id) {
      const result = await warehouseModel.deleteOne({ _id: req.params.id });

      if (!result.deletedCount)
        return apiResponse.validationErrorWithData(res, "Warehouse not found or Error occurred while deleting Warehouse.", { success: false });
      return apiResponse.successResponseWithData(res, "Warehouse deleted successfully.", result);
    } else
      return apiResponse.validationErrorWithData(res, "Warehouse ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle warehouse update
async function handleUpdate(req, res) {
  try {
    if (req.params.id) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      req.body.updated_at = new Date();
      const result = await warehouseModel.updateOne(
        { '_id': objectId },
        { $set: req.body }
      );
      if (result.modifiedCount) return apiResponse.successResponseWithData(res, "Warehouse Update Success.", result);
      else return apiResponse.validationErrorWithData(res, "Warehouse not found or Error occurred while updating Warehouse.", { success: false });
    } else
      return apiResponse.validationErrorWithData(res, "Warehouse ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle fetching list of warehouses
async function handleGetList(req, res) {
  try {
    let warehouses = await warehouseModel.find({}).sort({ created_at: -1 });

    apiResponse.successResponseWithData(res, "Fetch Warehouse Success.", warehouses);
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
