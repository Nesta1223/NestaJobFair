const router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/companies');
router.use(protect);
router.get('/', c.getCompanies);
router.get('/:id', c.getCompany);
module.exports = router;
