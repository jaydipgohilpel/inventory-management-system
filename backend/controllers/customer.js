const customerModel = require("../model/Customer");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

async function handleCreate(req, res) {
  try {
    if (req.body.customer_name) {
      const existingCustomer = await customerModel.findOne({
        customer_name: new RegExp('^' + req.body.customer_name + '$', 'i')
      });

      if (existingCustomer) {
        return apiResponse.validationErrorWithData(res, "Customer already exists.", { success: false });
      } else {
        req.body.user_id = req.user._id;
        const newCustomer = new customerModel(req.body);
        let result = await newCustomer.save();
        result = result.toObject();
        return apiResponse.successResponseWithData(res, "Customer created successfully.", result);
      }
    } else {
      return apiResponse.validationErrorWithData(res, "Customer name not provided.", "Invalid Data");
    }
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

async function handleDelete(req, res) {
  try {
    if (req.params.id) {
      const isCustomerUsed = await customerModel.exists({ customer_id: req.params.id });
      if (isCustomerUsed) {
        const numberOfProducts = await customerModel.countDocuments({ customer_id: req.params.id });
        const errorMessage = `Cannot delete the customer. It is currently associated with ${numberOfProducts} product${numberOfProducts !== 1 ? 's' : ''}.`;
        throw new Error(errorMessage);
      }

      const result = await customerModel.deleteOne({ _id: req.params.id });
      return apiResponse.successResponseWithData(res, 'Customer deleted successfully.', result);
    } else {
      return apiResponse.validationErrorWithData(res, "Customer ID not provided.", "Invalid Data");
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
      const result = await customerModel.updateOne(
        { '_id': objectId },
        { $set: req.body }
      );
      if (result.modifiedCount) return apiResponse.successResponseWithData(res, "Customer Update Success.", result);
      else return apiResponse.validationErrorWithData(res, "Customer not found or Error ocurred while updating customer.", { success: false });
    } else
      return apiResponse.validationErrorWithData(res, "Customer ID not provided.", "Invalid Data");
  } catch (error) {

    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      return apiResponse.validationErrorWithData(res, "Customer with this name already exists.", { success: false });
    } else {
      return apiResponse.validationErrorWithData(res, error.message, { success: false });
    }
  }
}

async function handleGetList(req, res) {
  try {
    let customers = await customerModel.find({}).sort({ created_at: -1 });
    apiResponse.successResponseWithData(res, "fetch customer Success.", customers);
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
