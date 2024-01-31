const supplierModel = require("../model/Supplier");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

async function handleCreate(req, res) {
  try {
    if (req.body.supplier_name) {
      const existingSupplier = await supplierModel.findOne({
        supplier_name: new RegExp('^' + req.body.supplier_name + '$', 'i')
      });

      if (existingSupplier) {
        return apiResponse.validationErrorWithData(res, "Supplier already exists.", { success: false });
      } else {
        const newSupplier = new supplierModel(req.body);
        let result = await newSupplier.save();
        result = result.toObject();
        return apiResponse.successResponseWithData(res, "Supplier created successfully.", result);
      }
    } else {
      return apiResponse.validationErrorWithData(res, "Supplier name not provided.", "Invalid Data");
    }
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

async function handleDelete(req, res) {
  try {
    if (req.params.id) {
      const isSupplierUsed = await supplierModel.exists({ supplier_id: req.params.id });
      if (isSupplierUsed) {
        const numberOfProducts = await supplierModel.countDocuments({ supplier_id: req.params.id });
        const errorMessage = `Cannot delete the supplier. It is currently associated with ${numberOfProducts} product${numberOfProducts !== 1 ? 's' : ''}.`;
        throw new Error(errorMessage);
      }

      const result = await supplierModel.deleteOne({ _id: req.params.id });
      return apiResponse.successResponseWithData(res, 'Supplier deleted successfully.', result);
    } else {
      return apiResponse.validationErrorWithData(res, "Supplier ID not provided.", "Invalid Data");
    }
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

async function handleUpdate(req, res) {
  try {
    if (req.params.id) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      req.body.updated_at = new Date();
      const result = await supplierModel.updateOne(
        { '_id': objectId },
        { $set: req.body }
      );
      if (result.modifiedCount) return apiResponse.successResponseWithData(res, "Supplier Update Success.", result);
      else return apiResponse.validationErrorWithData(res, "Supplier not found or Error ocurred while updating supplier.", { success: false });
    } else {
      return apiResponse.validationErrorWithData(res, "Supplier ID not provided.", "Invalid Data");
    }
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      return apiResponse.validationErrorWithData(res, "Supplier with this name already exists.", { success: false });
    } else {
      return apiResponse.validationErrorWithData(res, error.message, { success: false });
    }
  }
}

async function handleGetList(req, res) {
  try {
    let suppliers = await supplierModel.find({}).sort({ created_at: -1 });
    apiResponse.successResponseWithData(res, "Fetch supplier success.", suppliers);
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
