const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: 0
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'], // e.g., kg, liters, pcs
        enum: ['kg', 'g', 'l', 'ml', 'pcs', 'packs']
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    category: {
        type: String,
        default: 'General'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
