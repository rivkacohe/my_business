let express = require('express');
let router = express.Router();
const cm = require('../controllers/customers');
let mwAuth = require('../middleware/auth');
const fileMgmt = require('../shared/fileMgmt');


router.get('/', function(req, res, next) {
  const filePath = fileMgmt.getHtmlFilePath('customer-funcs.html');
  res.sendFile(filePath );
});

router.get('/home', function(req, res, next) {
  const filePath = fileMgmt.getHtmlFilePath('customer-card.html');
  res.sendFile(filePath );
});
 
router.get('/home1', function(req, res, next) {
  const filePath = fileMgmt.getHtmlFilePath('customers.html');
  res.sendFile(filePath );
});



//add business card
router.post('/businessCards', mwAuth, cm.addBusinesscard);
//get customer detailes
router.get('/customer-card', mwAuth, cm.getCustomerDetailes);
//get business card detailes by id
router.get('/businessCards', mwAuth,cm.getBusinessDetailes);
//edit business card
router.put('/businessCards', mwAuth, cm.editBusinesscard);
//delete business card
router.delete('/businessCards/:id', mwAuth, cm.deleteBusinesscard);
module.exports = router;
