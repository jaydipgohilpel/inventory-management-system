const productModel = require("../model/Product");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

async function handleCreate(req, res) {
  try {
    if (req.body.product_name || category_id || cost_price || selling_price || quantity_in_stock || reorder_point) {
      const existingProduct = await productModel.findOne({
        product_name: new RegExp('^' + req.body.product_name + '$', 'i')
      });

      if (existingProduct) return apiResponse.validationErrorWithData(res, "Product already exists.", { success: false });
      else {
        req.body.user_id = req.user._id;
        const newProduct = new productModel(req.body);
        let result = await newProduct.save();
        result = result.toObject();
        return apiResponse.successResponseWithData(res, "Product created successfully.", result);
      }
    }
    else return apiResponse.validationErrorWithData(res, "all data not provided, please provide necessary data", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

async function handleDelete(req, res) {
  try {
    if (req.params.id) {
      const result = await productModel.deleteOne({ _id: req.params.id });

      if (!result.deletedCount)
        return apiResponse.validationErrorWithData(res, "Product not found or Error ocurred while deleting Product.", { success: false });
      return apiResponse.successResponseWithData(res, "Product deleted successfully.", result);
    } else
      return apiResponse.validationErrorWithData(res, "Product ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

async function handleUpdate(req, res) {
  try {
    if (req.params.id) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      req.body.updated_at = new Date();
      const result = await productModel.updateOne(
        { '_id': objectId },
        { $set: req.body }
      );
      if (result.modifiedCount) return apiResponse.successResponseWithData(res, "Product Update Success.", result);
      else return apiResponse.validationErrorWithData(res, "Product not found or Error ocurred while updating Product.", { success: false });
    } else
      return apiResponse.validationErrorWithData(res, "Product ID not provided.", "Invalid Data");
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      return apiResponse.validationErrorWithData(res, "Product with this name already exists.", { success: false });
    } else {
      return apiResponse.validationErrorWithData(res, error.message, { success: false });
    }
  }
}

async function handleGetList(req, res) {
  try {
    let products = await productModel.find({}).sort({ created_at: -1 })
      .populate('category_id', 'category_name');

    const modifiedProducts = products.map(product => {
      const { category_id, ...rest } = product._doc;
      return {
        ...rest,
        category_name: product.category_id?.category_name,
        category_id: product.category_id?._id,
      };
    });

    apiResponse.successResponseWithData(res, "fetch Product Success.", modifiedProducts);
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