const alertModel = require("../model/Alerts");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

// Handle alert creation
async function handleCreate(req, res) {
  try {
    if (req.body.user_id && req.body.message) {
      const newAlert = new alertModel(req.body);
      let result = await newAlert.save();
      result = result.toObject();
      return apiResponse.successResponseWithData(res, "Alert created successfully.", result);
    } else {
      return apiResponse.validationErrorWithData(res, "Not all data provided. Please provide necessary data.", "Invalid Data");
    }
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle alert deletion
async function handleDelete(req, res) {
  try {
    if (req.params.id) {
      const result = await alertModel.deleteOne({ _id: req.params.id });

      if (!result.deletedCount)
        return apiResponse.validationErrorWithData(res, "Alert not found or Error occurred while deleting Alert.", { success: false });
      return apiResponse.successResponseWithData(res, "Alert deleted successfully.", result);
    } else
      return apiResponse.validationErrorWithData(res, "Alert ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle alert update
async function handleUpdate(req, res) {
  try {
    if (req.params.id) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      req.body.updated_at = new Date();
      const result = await alertModel.updateOne(
        { '_id': objectId },
        { $set: req.body }
      );
      if (result.modifiedCount) return apiResponse.successResponseWithData(res, "Alert Update Success.", result);
      else return apiResponse.validationErrorWithData(res, "Alert not found or Error occurred while updating Alert.", { success: false });
    } else
      return apiResponse.validationErrorWithData(res, "Alert ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle fetching list of alerts
async function handleGetList(req, res) {
  try {
    let alerts = await alertModel.find({}).sort({ created_at: -1 })
      .populate('user_id', 'username');

    const modifiedAlerts = alerts.map(alert => {
      const { user_id, ...rest } = alert._doc;
      return {
        ...rest,
        username: alert.user_id?.username,
        user_id: alert.user_id?._id,
      };
    });

    apiResponse.successResponseWithData(res, "Fetch Alert Success.", modifiedAlerts);
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
