var express = require('express');
var router = express.Router();
const { handleCreate, handleDelete, handleUpdate } = require("../controllers/category")
const authenticateToken = require('../middleware/authenticate');


router.post('', authenticateToken, handleCreate)
    .delete('/:id', authenticateToken, handleDelete)
    .patch('/:id', authenticateToken, handleUpdate);

module.exports = router;
