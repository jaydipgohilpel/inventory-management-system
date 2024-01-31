const auditTrailModel = require("../model/AuditTrail");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

// Handle audit trail creation
async function handleCreate(req, res) {
  try {
    // Check if all required data is provided
    if (req.body.user_id && req.body.action && req.body.table_name && req.body.record_id) {
      const newAuditTrail = new auditTrailModel(req.body);
      let result = await newAuditTrail.save();
      result = result.toObject();
      return apiResponse.successResponseWithData(res, "Audit Trail created successfully.", result);
    } else {
      return apiResponse.validationErrorWithData(res, "Not all data provided. Please provide necessary data.", "Invalid Data");
    }
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle audit trail deletion
async function handleDelete(req, res) {
  try {
    if (req.params.id) {
      const result = await auditTrailModel.deleteOne({ _id: req.params.id });

      if (!result.deletedCount)
        return apiResponse.validationErrorWithData(res, "Audit Trail not found or Error occurred while deleting Audit Trail.", { success: false });
      return apiResponse.successResponseWithData(res, "Audit Trail deleted successfully.", result);
    } else
      return apiResponse.validationErrorWithData(res, "Audit Trail ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle audit trail update
async function handleUpdate(req, res) {
  try {
    if (req.params.id) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      req.body.updated_at = new Date();
      const result = await auditTrailModel.updateOne(
        { '_id': objectId },
        { $set: req.body }
      );
      if (result.modifiedCount) return apiResponse.successResponseWithData(res, "Audit Trail Update Success.", result);
      else return apiResponse.validationErrorWithData(res, "Audit Trail not found or Error occurred while updating Audit Trail.", { success: false });
    } else
      return apiResponse.validationErrorWithData(res, "Audit Trail ID not provided.", "Invalid Data");
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

// Handle fetching list of audit trails
async function handleGetList(req, res) {
  try {
    let auditTrails = await auditTrailModel.find({}).sort({ created_at: -1 })
      .populate('user_id', 'username');

    const modifiedAuditTrails = auditTrails.map(auditTrail => {
      const { user_id, ...rest } = auditTrail._doc;
      return {
        ...rest,
        username: auditTrail.user_id?.username,
        user_id: auditTrail.user_id?._id,
      };
    });

    apiResponse.successResponseWithData(res, "Fetch Audit Trail Success.", modifiedAuditTrails);
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
