import { LoyaltyCard } from './models.js';

export const createLoyaltyCard = async (req, res) => {
  try {
    const { brandName, cardNumber, category, points, expiryDate, notes, cardImage, barcode } = req.body;
    const card = new LoyaltyCard({
      userId: req.user.id,
      brandName,
      cardNumber,
      category,
      points,
      expiryDate,
      notes,
      cardImage,
      barcode,
    });
    await card.save();
    res.status(201).json({ message: 'Loyalty card created', card });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyLoyaltyCards = async (req, res) => {
  try {
    const cards = await LoyaltyCard.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ cards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLoyaltyCard = async (req, res) => {
  try {
    const card = await LoyaltyCard.findOne({ _id: req.params.id, userId: req.user.id });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLoyaltyCard = async (req, res) => {
  try {
    const { brandName, cardNumber, category, points, expiryDate, notes, cardImage, barcode } = req.body;
    const card = await LoyaltyCard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { brandName, cardNumber, category, points, expiryDate, notes, cardImage, barcode },
      { new: true }
    );
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json({ message: 'Loyalty card updated', card });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLoyaltyCard = async (req, res) => {
  try {
    const card = await LoyaltyCard.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json({ message: 'Loyalty card deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addPoints = async (req, res) => {
  try {
    const { points } = req.body;
    const card = await LoyaltyCard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $inc: { points } },
      { new: true }
    );
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json({ message: 'Points added', card });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
