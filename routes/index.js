var express = require('express');
var router = express.Router();
const mwAuth = require('../middleware/auth');
const auth = require('../controllers/auth');
const fileMgmt = require('../shared/fileMgmt');

/* authentication */
router.get('/signin', function (req, res, next) {
  const filePath = fileMgmt.getHtmlFilePath('login.html');
  res.sendFile(filePath);
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('this is the home page. use ' );
});
/*Add customer */
router.get('/add-customer', function (req, res, next) {
  const filePath = fileMgmt.getHtmlFilePath('add-customer.html');
  res.sendFile(filePath);
});
//login
router.post('/login', auth.login);
//logout
router.get('/logout', mwAuth, function (req, res, next) {
  return res
    .clearCookie('access_token')
    .status(200)
    .send('Successfully logged out.');
})
module.exports = router;
