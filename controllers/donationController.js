const Donation = require('../models/Donation');


exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      donations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Create a new donation
exports.createDonation = async (req, res) => {
  try {
    const { name, amount, category, description } = req.body.product;
    console.log(`${name}, ${amount}, ${category}, ${description}, ${req.user.id}`); 
    
    // Create a new donation with the product structure
    const donation = await Donation.create({
      donor: req.user.id,
      product: {
        name,
        amount,
        category,
        description
      },
       // Optional message field
      transactionId: 'TXN_' + Date.now() // Unique transaction ID
    });

    console.log(donation); 

    res.status(201).json({
      success: true,
      donation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .sort('-createdAt');

    res.json({
      success: true,
      donations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};