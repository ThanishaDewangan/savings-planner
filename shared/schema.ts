import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  targetAmount: decimal("target_amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  goalId: integer("goal_id").references(() => goals.id).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  name: true,
  targetAmount: true,
  currency: true,
}).extend({
  name: z.string().min(1, "Goal name is required").max(100, "Goal name too long"),
  targetAmount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Target amount must be a positive number"),
  currency: z.enum(["INR", "USD"], { message: "Currency must be INR or USD" }),
});

export const insertContributionSchema = createInsertSchema(contributions).pick({
  goalId: true,
  amount: true,
  date: true,
}).extend({
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Contribution amount must be a positive number"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Contribution = typeof contributions.$inferSelect;
export type InsertContribution = z.infer<typeof insertContributionSchema>;

export interface GoalWithContributions extends Goal {
  contributions: Contribution[];
  totalSaved: string;
  progressPercentage: number;
  remaining: string;
}

export interface ExchangeRate {
  rate: number;
  lastUpdated: string;
}

export interface DashboardData {
  totalTarget: string;
  totalSaved: string;
  overallProgress: number;
  exchangeRate: ExchangeRate;
}
