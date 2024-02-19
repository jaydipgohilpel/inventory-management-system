const barcodeModel = require("../model/Barcode");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

// Handle barcode creation
async function handleCreate(req, res) {
  try {
    // Check if all required data is provided
    if (req.body.product_id && req.body.barcode_value) {
      const newBarcode = new barcodeModel(req.body);
      let result = await newBarcode.save();
      result = result.toObject();
      return apiResponse.successResponseWithData(res, "Barcode created successfully.", result);
    } else {
      return apiResponse.validationErrorWithData(res, "Not all data provided. Please provide necessary data.", "Invalid Data");
    }
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle barcode deletion
async function handleDelete(req, res) {
  try {
    if (req.params.id) {
      const result = await barcodeModel.deleteOne({ _id: req.params.id });

      if (!result.deletedCount)
        return apiResponse.validationErrorWithData(res, "Barcode not found or Error occurred while deleting Barcode.", { success: false });
      return apiResponse.successResponseWithData(res, "Barcode deleted successfully.", result);
    } else
      return apiResponse.validationErrorWithData(res, "Barcode ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle barcode update
async function handleUpdate(req, res) {
  try {
    if (req.params.id) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      req.body.updated_at = new Date();
      const result = await barcodeModel.updateOne(
        { '_id': objectId },
        { $set: req.body }
      );
      if (result.modifiedCount) return apiResponse.successResponseWithData(res, "Barcode Update Success.", result);
      else return apiResponse.validationErrorWithData(res, "Barcode not found or Error occurred while updating Barcode.", { success: false });
    } else
      return apiResponse.validationErrorWithData(res, "Barcode ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle fetching list of barcodes
async function handleGetList(req, res) {
  try {
    let barcodes = await barcodeModel.find({}).sort({ created_at: -1 })
      .populate('product_id', 'product_name');

    const modifiedBarcodes = barcodes.map(barcode => {
      const { product_id, ...rest } = barcode._doc;
      return {
        ...rest,
        product_name: barcode.product_id?.product_name,
        product_id: barcode.product_id?._id,
      };
    });

    apiResponse.successResponseWithData(res, "Fetch Barcode Success.", modifiedBarcodes);
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
