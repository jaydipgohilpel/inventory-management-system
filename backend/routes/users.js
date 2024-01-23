var express = require('express');
var router = express.Router();
const { handleCreate, handleLogin, handleGetList } = require("../controllers/users")
const authenticateToken = require('../middleware/authenticate');

router.post('/register', handleCreate);
router.post('/login', handleLogin);
router.get('/list', authenticateToken, handleGetList);

module.exports = router;
