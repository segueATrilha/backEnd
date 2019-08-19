const mongoose = require('mongoose');

const TrailSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    initialPoint: {
        type: {
            enum: ["Point", "MultiPoint"],
            type: String,
            trim: true,
            default: "Point",
            required: true
        },
        coordinates: [{
            type: Number,
            default: 0,
            required: true
        }],
        required: true
    },
    breakPoints: {
        type: {
            enum: ["Point", "MultiPoint"],
            type: String,
            trim: true,
            default: "MultiPoint",
        },
        coordinates: [[
            {
                type: Number,
                default: 0,
            }
        ]],
    },
    finalPoint: {
        type: {
            enum: ["Point", "MultiPoint"],
            type: String,
            trim: true,
            default: "Point",
            required: true
        },
        coordinates: [{
            type: Number,
            default: 0,
            required: true
        }],
        required: true,
    }
});

module.exports = mongoose.model('Trail', TrailSchema);