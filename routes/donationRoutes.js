const express = require('express');
const router = express.Router();
const { 
  createDonation, 
  getAllDonations,
  getUserDonations 
} = require('../controllers/donationController');

router.post('/', createDonation);
router.get('/', getAllDonations);
router.get('/my-donations', getUserDonations);

module.exports = router;