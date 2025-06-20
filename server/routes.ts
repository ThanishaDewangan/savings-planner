import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGoalSchema, insertContributionSchema, type DashboardData, type ExchangeRate } from "@shared/schema";
import { z } from "zod";
import "dotenv/config";

export async function registerRoutes(app: Express): Promise<Server> {
  // Exchange Rate API
  app.get("/api/exchange-rate", async (req, res) => {
    try {
      const apiKey = process.env.EXCHANGE_RATE_API_KEY;
      if (!apiKey) {
        throw new Error("Exchange rate API key not configured");
      }
      
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
      if (!response.ok) {
        throw new Error(`Exchange rate API error: ${response.status}`);
      }
      const data = await response.json();
      
      const exchangeRate: ExchangeRate = {
        rate: data.conversion_rates.INR,
        lastUpdated: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      };
      
      res.json(exchangeRate);
    } catch (error) {
      console.error("Exchange rate fetch error:", error);
      res.status(500).json({ 
        message: "Failed to fetch exchange rate", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Goals API
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getGoals();
      res.json(goals);
    } catch (error) {
      console.error("Get goals error:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.get("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid goal ID" });
      }

      const goal = await storage.getGoal(id);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }

      res.json(goal);
    } catch (error) {
      console.error("Get goal error:", error);
      res.status(500).json({ message: "Failed to fetch goal" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const validatedData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(validatedData);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Create goal error:", error);
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  // Contributions API
  app.post("/api/contributions", async (req, res) => {
    try {
      const validatedData = insertContributionSchema.parse(req.body);
      const contribution = await storage.createContribution(validatedData);
      res.status(201).json(contribution);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Create contribution error:", error);
      res.status(500).json({ message: "Failed to create contribution" });
    }
  });

  // Dashboard API
  app.get("/api/dashboard", async (req, res) => {
    try {
      const goals = await storage.getGoals();
      
      // Fetch current exchange rate
      let exchangeRate: ExchangeRate;
      try {
        const apiKey = process.env.EXCHANGE_RATE_API_KEY;
        if (!apiKey) {
          throw new Error("Exchange rate API key not configured");
        }
        
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        if (!response.ok) {
          throw new Error(`Exchange rate API error: ${response.status}`);
        }
        const data = await response.json();
        exchangeRate = {
          rate: data.conversion_rates.INR,
          lastUpdated: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
        };
      } catch (error) {
        console.error("Dashboard exchange rate fetch error:", error);
        // Return error instead of fallback data
        return res.status(500).json({ 
          message: "Failed to fetch exchange rate", 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }

      // Calculate totals
      let totalTargetINR = 0;
      let totalSavedINR = 0;

      for (const goal of goals) {
        const targetAmount = parseFloat(goal.targetAmount);
        const savedAmount = parseFloat(goal.totalSaved);

        if (goal.currency === "USD") {
          totalTargetINR += targetAmount * exchangeRate.rate;
          totalSavedINR += savedAmount * exchangeRate.rate;
        } else {
          totalTargetINR += targetAmount;
          totalSavedINR += savedAmount;
        }
      }

      const overallProgress = totalTargetINR > 0 ? (totalSavedINR / totalTargetINR) * 100 : 0;

      const dashboardData: DashboardData = {
        totalTarget: totalTargetINR.toFixed(2),
        totalSaved: totalSavedINR.toFixed(2),
        overallProgress: Math.min(overallProgress, 100),
        exchangeRate,
      };

      res.json(dashboardData);
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
