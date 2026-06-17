import { Warranty } from './models.js';

export const createWarranty = async (req, res) => {
  try {
    const { productName, purchaseDate, warrantyDuration, warrantyUnit, amount, vendor, category, warrantyImage, notes } = req.body;
    
    const purchaseTime = new Date(purchaseDate);
    let expiryDate = new Date(purchaseTime);
    
    if (warrantyUnit === 'days') expiryDate.setDate(expiryDate.getDate() + warrantyDuration);
    else if (warrantyUnit === 'months') expiryDate.setMonth(expiryDate.getMonth() + warrantyDuration);
    else if (warrantyUnit === 'years') expiryDate.setFullYear(expiryDate.getFullYear() + warrantyDuration);
    
    const warranty = new Warranty({
      userId: req.user.id,
      productName,
      purchaseDate,
      warrantyDuration,
      warrantyUnit,
      expiryDate,
      amount,
      vendor,
      category,
      warrantyImage,
      notes,
    });
    await warranty.save();
    res.status(201).json({ message: 'Warranty created', warranty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyWarranties = async (req, res) => {
  try {
    const warranties = await Warranty.find({ userId: req.user.id }).sort({ expiryDate: 1 });
    res.json({ warranties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWarranty = async (req, res) => {
  try {
    const warranty = await Warranty.findOne({ _id: req.params.id, userId: req.user.id });
    if (!warranty) return res.status(404).json({ error: 'Warranty not found' });
    res.json(warranty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateWarranty = async (req, res) => {
  try {
    const { productName, purchaseDate, warrantyDuration, warrantyUnit, amount, vendor, category, warrantyImage, notes } = req.body;
    
    const purchaseTime = new Date(purchaseDate);
    let expiryDate = new Date(purchaseTime);
    
    if (warrantyUnit === 'days') expiryDate.setDate(expiryDate.getDate() + warrantyDuration);
    else if (warrantyUnit === 'months') expiryDate.setMonth(expiryDate.getMonth() + warrantyDuration);
    else if (warrantyUnit === 'years') expiryDate.setFullYear(expiryDate.getFullYear() + warrantyDuration);
    
    const warranty = await Warranty.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { productName, purchaseDate, warrantyDuration, warrantyUnit, expiryDate, amount, vendor, category, warrantyImage, notes },
      { new: true }
    );
    if (!warranty) return res.status(404).json({ error: 'Warranty not found' });
    res.json({ message: 'Warranty updated', warranty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWarranty = async (req, res) => {
  try {
    const warranty = await Warranty.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!warranty) return res.status(404).json({ error: 'Warranty not found' });
    res.json({ message: 'Warranty deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getExpiringWarranties = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const warranties = await Warranty.find({
      userId: req.user.id,
      expiryDate: { $gte: today, $lte: thirtyDaysFromNow },
    }).sort({ expiryDate: 1 });
    
    res.json({ warranties, count: warranties.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
