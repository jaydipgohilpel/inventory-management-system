var express = require('express');
var router = express.Router();
const { handleCreate, handleLogin } = require("../controllers/users")

router.post('/register', handleCreate);
router.post('/login', handleLogin);

module.exports = router;
