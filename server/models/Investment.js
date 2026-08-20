const mongoose = require("mongoose");


const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestmentPlan",
      required: true,
    },


    amount: {
      type: Number,
      required: true,
    },


    expectedReturn: {
      type: Number,
      required: true,
    },


    startDate: {
      type: Date,
      default: Date.now,
    },


    endDate: {
      type: Date,
      required: true,
    },


    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model(
  "Investment",
  investmentSchema
);