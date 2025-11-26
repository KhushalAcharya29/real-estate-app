import { Interest } from './interest.model';
import { Property } from '../properties/property.model';
// 🧍‍♂️ Client: express interest in a property
export const expressInterest = async (req, res) => {
    try {
        const user = req.user;
        const { propertyId, message } = req.body;
        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property)
            return res.status(404).json({ message: 'Property not found' });
        // Create or ignore if already exists
        const interest = await Interest.findOneAndUpdate({ propertyId, clientId: user.sub }, { message }, { upsert: true, new: true });
        res.status(201).json({ data: interest });
    }
    catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ message: 'Already expressed interest' });
        res.status(500).json({ message: err.message });
    }
};
// 🧍‍♂️ Client: get all interested properties
export const getMyInterests = async (req, res) => {
    try {
        const user = req.user;
        const interests = await Interest.find({ clientId: user.sub })
            .populate('propertyId');
        res.json({ data: interests });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// 🧍‍♂️ Client: remove interest
export const removeInterest = async (req, res) => {
    try {
        const user = req.user;
        const { propertyId } = req.params;
        const interest = await Interest.findOneAndDelete({
            clientId: user.sub,
            propertyId,
        });
        if (!interest)
            return res.status(404).json({ message: 'Interest not found' });
        res.json({ message: 'Interest removed successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// 🧑‍💼 Agent: view clients interested in their property
export const getInterestedClients = async (req, res) => {
    try {
        const user = req.user;
        const { propertyId } = req.params;
        // ensure the property belongs to agent
        const property = await Property.findOne({ _id: propertyId, agentId: user.sub });
        if (!property)
            return res.status(403).json({ message: 'Not authorized' });
        const interests = await Interest.find({ propertyId })
            .populate('clientId', 'name email');
        res.json({ data: interests });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
