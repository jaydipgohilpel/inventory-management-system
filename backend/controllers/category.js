const categoryModel = require("../model/Category");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

async function handleCreate(req, res) {
  try {
    if (req.body.category_name) {
      const existingCategory = await categoryModel.findOne({
        category_name: new RegExp('^' + req.body.category_name + '$', 'i')
      });

      if (existingCategory) return apiResponse.validationErrorWithData(res, "Category already exists.", { success: false });
      else {
        req.body.user_id = req.user._id;
        const newCategory = new categoryModel(req.body);
        let result = await newCategory.save();
        result = result.toObject();
        return apiResponse.successResponseWithData(res, "Category created successfully.", result);
      }
    }
    else return apiResponse.validationErrorWithData(res, "Category name not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

async function handleDelete(req, res) {
  try {
    if (req.params.id) {
      const result = await categoryModel.deleteOne({ _id: req.params.id });

      if (!result.deletedCount)
        return apiResponse.validationErrorWithData(res, "Category not found or Error ocurred while deleting category.", { success: false });
      return apiResponse.successResponseWithData(res, "Category deleted successfully.", result);
    } else
      return apiResponse.validationErrorWithData(res, "Category ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

async function handleUpdate(req, res) {
  try {
    if (req.params.id) {
      const existingCategory = await categoryModel.findOne({
        category_name: new RegExp('^' + req.body.category_name + '$', 'i')
      });

      if (existingCategory) return apiResponse.validationErrorWithData(res, "Category already exists.", { success: false });

      const objectId = new mongoose.Types.ObjectId(req.params.id);
      req.body.updated_at = new Date();
      const result = await categoryModel.updateOne(
        { '_id': objectId },
        { $set: req.body }
      );
      if (result.modifiedCount) return apiResponse.successResponseWithData(res, "Category Update Success.", result);
      else return apiResponse.validationErrorWithData(res, "Category not found or Error ocurred while updating category.", { success: false });
    } else
      return apiResponse.validationErrorWithData(res, "Category ID not provided.", "Invalid Data");
  } catch (error) {

    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      return apiResponse.validationErrorWithData(res, "Category with this name already exists.", { success: false });
    } else {
      return apiResponse.validationErrorWithData(res, error.message, { success: false });
    }
  }
}

async function handleGetList(req, res) {
  try {
    let categories = await categoryModel.find({}).sort({ created_at: -1 });
    apiResponse.successResponseWithData(res, "fetch category Success.", categories);
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

module.exports =
{
  handleCreate,
  handleDelete,
  handleUpdate,
  handleGetList
}