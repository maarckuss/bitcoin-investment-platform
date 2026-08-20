const mongoose = require("mongoose");

const investmentPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    minimumAmount: {
      type: Number,
      required: true,
    },

    roi: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model(
  "InvestmentPlan",
  investmentPlanSchema
);