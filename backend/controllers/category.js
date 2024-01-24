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
        const newCategory = new categoryModel(req.body);
        let result = await newCategory.save();
        result = result.toObject();
        return apiResponse.successResponseWithData(res, "Category created successfully.", result);
      }
    }
    else return apiResponse.validationErrorWithData(res, "Category name not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error, { success: false });
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
    return apiResponse.validationErrorWithData(res, error, { success: false });
  }
}

async function handleUpdate(req, res) {
  try {
    if (req.params.id) {
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
    return apiResponse.validationErrorWithData(res, error, { success: false });
  }
}

module.exports =
{
  handleCreate,
  handleDelete,
  handleUpdate
}