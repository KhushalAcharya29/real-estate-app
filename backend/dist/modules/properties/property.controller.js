import { Property } from './property.model';
// 📍 Public: list properties with filters
export const listProperties = async (req, res) => {
    try {
        const { city, minPrice, maxPrice, q, beds, baths, page = 1, limit = 10 } = req.query;
        const filters = { status: 'available' };
        if (city)
            filters['location.city'] = { $regex: new RegExp(city, 'i') };
        if (minPrice || maxPrice)
            filters.price = {
                ...(minPrice ? { $gte: Number(minPrice) } : {}),
                ...(maxPrice ? { $lte: Number(maxPrice) } : {})
            };
        if (beds)
            filters.bedrooms = { $gte: Number(beds) };
        if (baths)
            filters.bathrooms = { $gte: Number(baths) };
        if (q)
            filters.$text = { $search: q };
        const skip = (Number(page) - 1) * Number(limit);
        const properties = await Property.find(filters)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Property.countDocuments(filters);
        res.json({ data: properties, total, page: Number(page) });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// 📍 Public: get single property details
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property)
            return res.status(404).json({ message: 'Property not found' });
        res.json({ data: property });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// 🧱 Agent: create property
export const createProperty = async (req, res) => {
    try {
        const user = req.user;
        const data = req.body;
        const property = await Property.create({ ...data, agentId: user.sub });
        res.status(201).json({ data: property });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// 🧱 Agent: update property
export const updateProperty = async (req, res) => {
    try {
        const user = req.user;
        const property = await Property.findOneAndUpdate({ _id: req.params.id, agentId: user.sub }, req.body, { new: true });
        if (!property)
            return res.status(404).json({ message: 'Property not found or unauthorized' });
        res.json({ data: property });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// 🧱 Agent: delete property
export const deleteProperty = async (req, res) => {
    try {
        const user = req.user;
        const property = await Property.findOneAndDelete({ _id: req.params.id, agentId: user.sub });
        if (!property)
            return res.status(404).json({ message: 'Property not found or unauthorized' });
        res.json({ message: 'Property deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// 🧱 Agent: get properties of logged-in agent
export const getAgentProperties = async (req, res) => {
    try {
        const user = req.user;
        const properties = await Property.find({ agentId: user.sub }).sort({ createdAt: -1 });
        res.json({ data: properties });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
