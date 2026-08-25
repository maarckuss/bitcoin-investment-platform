require("dotenv").config({
  path: require("path").resolve(__dirname, ".env"),
});

const dns = require("dns");

// Use Google's DNS for MongoDB Atlas SRV resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const ActivityLog = require("./models/ActivityLog");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticateToken = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");
const adminOnly = require("./middleware/adminMiddleware");

const Withdrawal = require("./models/Withdrawal");
const InvestmentPlan = require("./models/InvestmentPlan");
const Investment = require("./models/Investment");
const Notification = require("./models/Notification");
const Testimonial = require("./models/Testimonial");

const crypto = require("crypto");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const app = express();

const User = require("./models/User");
const Deposit = require("./models/Deposit");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected 🚀"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Middleware
app.use(cors());
app.use(express.json());
// Test route
app.get("/", (req, res) => {
  res.send("Crypto Backend Running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.post("/api/deposit", authenticateToken, async (req, res) => {
  const { amount } = req.body;
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.blocked) {
      return res.status(403).json({
        message: "Your account is blocked. Deposit not allowed.",
      });
    }

    const newDeposit = await Deposit.create({
      userId: req.user.userId,
      amount,
      status: "pending",
    });

    res.status(201).json({
      message: "Deposit request submitted",
      deposit: newDeposit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/api/deposits", async (req, res) => {
  try {
    const allDeposits = await Deposit.find();
    res.json(allDeposits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
app.patch(
  "/api/deposits/:id/approve",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const deposit = await Deposit.findById(req.params.id);

      if (!deposit) {
        return res.status(404).json({ message: "Deposit not found" });
      }

      if (deposit.status === "approved") {
        return res.status(400).json({ message: "Already approved" });
      }

      const user = await User.findById(deposit.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.balance += Number(deposit.amount);
      await user.save();

      deposit.status = "approved";
      await deposit.save();

      // 🔔 CREATE NOTIFICATION
      console.log("CREATING DEPOSIT NOTIFICATION");

      await Notification.create({
        userId: deposit.userId,
        message: `Your ${deposit.coin} deposit of $${deposit.amount} has been approved.`,
      });

      console.log("NOTIFICATION CREATED");
      await ActivityLog.create({
        adminId: req.user.userId,
        action: "Approved Deposit",
        targetUserId: deposit.userId,
        amount: deposit.amount,
      });

      res.json({
        message: "Deposit approved successfully",
        deposit,
        user,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // ✅ Compare password properly
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    if (user.blocked) {
      return res.status(403).json({
        message: "Your account has been blocked. Contact support.",
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // remove password before sending response
    const { password: _, ...safeUser } = user.toObject();

    res.json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      balance: 0,
      role: "user",
    });

    await newUser.save();

    const { password: _, ...safeUser } = newUser.toObject();

    try {
      console.log("Sending welcome email to:", email);

      const { data, error } = await resend.emails.send({
        from: "BitcoinVault <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to BitcoinVault",
        html: `
          <div style="font-family:Arial,sans-serif;background:#0b1220;padding:40px 20px;color:#fff">
            <div style="max-width:600px;margin:auto;background:#111827;padding:32px;border-radius:16px">
              <h1 style="color:#f59e0b">Welcome to BitcoinVault</h1>

              <p>Hello ${name},</p>

              <p>Your account has been successfully created.</p>

              <p>You can now log in and access your investment dashboard.</p>

              <p style="margin-top:30px">
                Thank you for joining BitcoinVault.
              </p>

              <p style="color:#9ca3af;margin-top:30px">
                BitcoinVault Team
              </p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("Resend email error:", error);
      } else {
        console.log("Welcome email sent successfully:", data.id);
      }
    } catch (emailError) {
      console.error("Registration email error:", emailError);
    }

    res.status(201).json({
      message: "Registration successful",
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/api/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset token is invalid or expired.",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      message: "Password reset successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/api/users/:id/deposits", async (req, res) => {
  try {
    const userDeposits = await Deposit.find({
      userId: req.params.id,
    });

    res.json(userDeposits);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/api/withdraw", authenticateToken, async (req, res) => {
  const { amount, walletAddress } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.blocked) {
      return res.status(403).json({
        message: "Your account is blocked. Withdrawal not allowed.",
      });
    }

    const withdrawAmount = Number(amount);

    if (user.balance < withdrawAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // ✅ LOCK MONEY IMMEDIATELY
    user.balance -= withdrawAmount;
    await user.save();

    const withdrawal = await Withdrawal.create({
      userId: req.user.userId,
      amount: withdrawAmount,
      walletAddress,
      status: "pending",
    });

    res.status(201).json({
      message: "Withdrawal request submitted",
      withdrawal,
      newBalance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/transactions", authenticateToken, async (req, res) => {
  try {
    const deposits = await Deposit.find({
      userId: req.user.userId,
    });

    const withdrawals = await Withdrawal.find({
      userId: req.user.userId,
    });

    const transactions = [
      ...deposits.map((deposit) => ({
        type: "deposit",
        ...deposit.toObject(),
      })),

      ...withdrawals.map((withdrawal) => ({
        type: "withdrawal",
        ...withdrawal.toObject(),
      })),
    ];

    res.json(transactions);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/api/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const deposits = await Deposit.find({ userId });
    const withdrawals = await Withdrawal.find({ userId });

    const investments = await Investment.find({
      userId,
      status: "active",
    });
    const user = await User.findById(userId);
    const totalDeposits = deposits
      .filter((d) => d.status === "approved")
      .reduce((sum, d) => sum + Number(d.amount || 0), 0);

    const totalWithdrawals = withdrawals
      .filter((w) => w.status === "approved")
      .reduce((sum, w) => sum + Number(w.amount || 0), 0);

    const pendingDeposits = deposits.filter(
      (d) => d.status === "pending",
    ).length;

    const pendingWithdrawals = withdrawals.filter(
      (w) => w.status === "pending",
    ).length;

    const lockedBalance = withdrawals
      .filter((w) => w.status === "pending")
      .reduce((sum, w) => sum + Number(w.amount || 0), 0);
    const activeInvestments = investments.length;
    const investedAmount = investments.reduce(
      (sum, investment) => sum + Number(investment.amount || 0),
      0,
    );
    const expectedReturn = investments.reduce(
      (sum, investment) => sum + Number(investment.expectedReturn || 0),
      0,
    );
    const expectedProfit = expectedReturn - investedAmount;
    const portfolioValue = user.balance + investedAmount;

    res.json({
      balance: user.balance,

      portfolioValue,

      activeInvestments,

      investedAmount,

      expectedReturn,

      expectedProfit,

      lockedBalance,

      totalDeposits,

      totalWithdrawals,

      pendingDeposits,

      pendingWithdrawals,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

app.get(
  "/api/admin/dashboard",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();

      const deposits = await Deposit.find();
      const withdrawals = await Withdrawal.find();

      const totalDeposits = deposits.reduce(
        (sum, d) => sum + Number(d.amount || 0),
        0,
      );
      const totalWithdrawals = withdrawals.reduce(
        (sum, w) => sum + Number(w.amount || 0),
        0,
      );

      const netFlow = totalDeposits - totalWithdrawals;

      const pendingDeposits = deposits.filter(
        (d) => d.status === "pending",
      ).length;
      const pendingWithdrawals = withdrawals.filter(
        (w) => w.status === "pending",
      ).length;

      const recentUsers = await User.find()
        .sort({ _id: -1 })
        .limit(5)
        .select("-password");

      const recentDeposits = await Deposit.find()
        .sort({ createdAt: -1 })
        .limit(5);

      const recentWithdrawals = await Withdrawal.find()
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        totalUsers,
        totalDeposits,
        totalWithdrawals,
        pendingDeposits,
        pendingWithdrawals,
        netFlow,

        recentUsers,
        recentDeposits,
        recentWithdrawals,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

app.patch(
  "/api/deposits/:id/reject",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      await Deposit.findByIdAndUpdate(req.params.id, {
        status: "rejected",
      });

      res.json({ message: "Deposit rejected" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

app.patch(
  "/api/withdrawals/:id/reject",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const withdrawal = await Withdrawal.findById(req.params.id);

      if (!withdrawal) {
        return res.status(404).json({ message: "Withdrawal not found" });
      }

      if (withdrawal.status !== "pending") {
        return res.status(400).json({ message: "Already processed" });
      }

      const user = await User.findById(withdrawal.userId);

      if (user) {
        user.balance += Number(withdrawal.amount);
        await user.save();
      }

      withdrawal.status = "rejected";
      await withdrawal.save();

      await Notification.create({
        userId: withdrawal.userId,
        message: `Your withdrawal request of $${withdrawal.amount} was rejected.`,
      });

      res.json({ message: "Withdrawal rejected and refunded" });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: err.message,
      });
    }
  },
);

app.patch(
  "/api/withdrawals/:id/approve",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const withdrawal = await Withdrawal.findById(req.params.id);

      if (!withdrawal) {
        return res.status(404).json({
          message: "Withdrawal not found",
        });
      }

      if (withdrawal.status === "approved") {
        return res.status(400).json({
          message: "Already approved",
        });
      }

      withdrawal.status = "approved";
      await withdrawal.save();
      await Notification.create({
        userId: withdrawal.userId,
        message: `Your withdrawal request of $${withdrawal.amount} has been approved.`,
      });
      await ActivityLog.create({
        adminId: req.user.userId,
        action: "Approved Withdrawal",
        targetUserId: withdrawal.userId,
        amount: withdrawal.amount,
      });

      res.json({
        message: "Withdrawal approved successfully",
        withdrawal,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

app.patch(
  "/api/users/:id/role",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true },
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "Role updated successfully",
        user,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

app.patch(
  "/api/users/:id/balance",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const { amount } = req.body;

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.balance += Number(amount);

      if (user.balance < 0) {
        user.balance = 0;
      }

      await user.save();

      res.json({
        message: "Balance updated successfully",
        balance: user.balance,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

app.patch(
  "/api/users/:id/block",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const { blocked } = req.body;

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.blocked = blocked;

      await user.save();
      await ActivityLog.create({
        adminId: req.user.userId,
        action: blocked ? "Blocked User" : "Unblocked User",
        targetUserId: req.params.id,
      });

      res.json({
        message: blocked
          ? "User blocked successfully"
          : "User unblocked successfully",
        user,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);
app.get("/api/admin/logs", authenticateToken, adminOnly, async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get(
  "/api/admin/transactions",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const deposits = await Deposit.find().sort({ createdAt: -1 });

      const withdrawals = await Withdrawal.find().sort({ createdAt: -1 });

      res.json({
        deposits,
        withdrawals,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);
app.post(
  "/api/admin/plans",
  authenticateToken,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, minimumAmount, roi, duration, description } = req.body;

      const plan = await InvestmentPlan.create({
        name,
        minimumAmount,
        roi,
        duration,
        description,
      });

      res.status(201).json(plan);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

app.get("/api/plans", authenticateToken, async (req, res) => {
  try {
    const plans = await InvestmentPlan.find({
      active: true,
    });

    res.json(plans);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/api/invest", authenticateToken, async (req, res) => {
  try {
    const { planId, amount } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const plan = await InvestmentPlan.findById(planId);

    if (!plan || !plan.active) {
      return res.status(404).json({
        message: "Investment plan not available",
      });
    }

    const investAmount = Number(amount);

    if (investAmount < plan.minimumAmount) {
      return res.status(400).json({
        message: `Minimum investment is $${plan.minimumAmount}`,
      });
    }

    if (user.balance < investAmount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // Calculate expected return
    const profit = (plan.roi / 100) * investAmount;

    const expectedReturn = investAmount + profit;

    // Calculate maturity date
    const endDate = new Date();

    endDate.setDate(endDate.getDate() + plan.duration);

    // Lock user funds
    user.balance -= investAmount;

    await user.save();

    const investment = await Investment.create({
      userId: user._id,
      planId: plan._id,
      amount: investAmount,
      expectedReturn,
      endDate,
      status: "active",
    });

    res.status(201).json({
      message: "Investment created successfully",
      investment,
      newBalance: user.balance,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/api/my-investments", authenticateToken, async (req, res) => {
  try {
    const investments = await Investment.find({
      userId: req.user.userId,
    }).populate("planId");

    res.json(investments);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.patch(
  "/api/admin/complete-investment/:id",
  authenticateToken,
  adminMiddleware,
  async (req, res) => {
    try {
      const investment = await Investment.findById(req.params.id);

      if (!investment) {
        return res.status(404).json({
          message: "Investment not found",
        });
      }

      if (investment.status === "completed") {
        return res.status(400).json({
          message: "Investment already completed",
        });
      }

      const user = await User.findById(investment.userId);

      user.balance += investment.expectedReturn;

      await user.save();

      investment.status = "completed";

      await investment.save();

      await Notification.create({
        userId: investment.userId,
        message: `Congratulations! Your investment has completed successfully. $${investment.expectedReturn} has been credited to your account.`,
      });
      res.json({
        message: "Investment completed successfully",
        investment,
        newBalance: user.balance,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

app.get(
  "/api/admin/investments",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const investments = await Investment.find()
        .populate("userId", "name email")
        .populate("planId", "name roi duration");

      res.json(investments);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

app.get("/api/notifications", authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/test-notification", async (req, res) => {
  const notification = await Notification.create({
    userId: "6a2f86f1a45128b44cae696e",
    message: "Test notification",
  });

  res.json(notification);
});

app.patch(
  "/api/notifications/:id/read",
  authenticateToken,
  async (req, res) => {
    try {
      const notification = await Notification.findOne({
        _id: req.params.id,
        userId: req.user.userId,
      });

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      notification.read = true;

      await notification.save();

      res.json(notification);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

app.patch(
  "/api/notifications/:id/unread",
  authenticateToken,
  async (req, res) => {
    try {
      const notification = await Notification.findOne({
        _id: req.params.id,
        userId: req.user.userId,
      });

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      notification.read = false;

      await notification.save();

      res.json(notification);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.patch("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    res.json({
      message: "Profile updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({
      featured: -1,
      createdAt: -1,
    });

    res.json(testimonials);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post(
  "/api/admin/testimonials",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const testimonial = await Testimonial.create(req.body);

      res.status(201).json({
        message: "Testimonial created successfully.",
        testimonial,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);
app.patch(
  "/api/admin/testimonials/:id",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const testimonial = await Testimonial.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );

      if (!testimonial) {
        return res.status(404).json({
          message: "Testimonial not found",
        });
      }

      res.json({
        message: "Testimonial updated successfully",
        testimonial,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

app.delete(
  "/api/admin/testimonials/:id",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

      if (!testimonial) {
        return res.status(404).json({
          message: "Testimonial not found",
        });
      }

      res.json({
        message: "Testimonial deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

app.patch(
  "/api/admin/testimonials/:id/feature",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const testimonial = await Testimonial.findById(req.params.id);

      if (!testimonial) {
        return res.status(404).json({
          message: "Testimonial not found",
        });
      }

      testimonial.featured = !testimonial.featured;

      await testimonial.save();

      res.json({
        message: testimonial.featured
          ? "Testimonial featured"
          : "Testimonial removed from featured",
        testimonial,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
