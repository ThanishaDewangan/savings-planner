import { goals, contributions, type Goal, type InsertGoal, type Contribution, type InsertContribution, type GoalWithContributions } from "@shared/schema";

export interface IStorage {
  // Goals
  getGoals(): Promise<GoalWithContributions[]>;
  getGoal(id: number): Promise<GoalWithContributions | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  
  // Contributions
  getContributionsByGoalId(goalId: number): Promise<Contribution[]>;
  createContribution(contribution: InsertContribution): Promise<Contribution>;
}

export class MemStorage implements IStorage {
  private goals: Map<number, Goal>;
  private contributions: Map<number, Contribution>;
  private currentGoalId: number;
  private currentContributionId: number;

  constructor() {
    this.goals = new Map();
    this.contributions = new Map();
    this.currentGoalId = 1;
    this.currentContributionId = 1;
  }

  async getGoals(): Promise<GoalWithContributions[]> {
    const goalsArray = Array.from(this.goals.values());
    const goalsWithContributions: GoalWithContributions[] = [];

    for (const goal of goalsArray) {
      const goalContributions = await this.getContributionsByGoalId(goal.id);
      const totalSaved = goalContributions.reduce((sum, contrib) => sum + parseFloat(contrib.amount), 0);
      const progressPercentage = (totalSaved / parseFloat(goal.targetAmount)) * 100;
      const remaining = parseFloat(goal.targetAmount) - totalSaved;

      goalsWithContributions.push({
        ...goal,
        contributions: goalContributions,
        totalSaved: totalSaved.toFixed(2),
        progressPercentage: Math.min(progressPercentage, 100),
        remaining: Math.max(remaining, 0).toFixed(2),
      });
    }

    return goalsWithContributions;
  }

  async getGoal(id: number): Promise<GoalWithContributions | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;

    const goalContributions = await this.getContributionsByGoalId(goal.id);
    const totalSaved = goalContributions.reduce((sum, contrib) => sum + parseFloat(contrib.amount), 0);
    const progressPercentage = (totalSaved / parseFloat(goal.targetAmount)) * 100;
    const remaining = parseFloat(goal.targetAmount) - totalSaved;

    return {
      ...goal,
      contributions: goalContributions,
      totalSaved: totalSaved.toFixed(2),
      progressPercentage: Math.min(progressPercentage, 100),
      remaining: Math.max(remaining, 0).toFixed(2),
    };
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.currentGoalId++;
    const goal: Goal = {
      ...insertGoal,
      id,
      createdAt: new Date(),
    };
    this.goals.set(id, goal);
    return goal;
  }

  async getContributionsByGoalId(goalId: number): Promise<Contribution[]> {
    return Array.from(this.contributions.values()).filter(
      (contribution) => contribution.goalId === goalId
    );
  }

  async createContribution(insertContribution: InsertContribution): Promise<Contribution> {
    const id = this.currentContributionId++;
    const contribution: Contribution = {
      ...insertContribution,
      id,
      date: new Date(insertContribution.date),
      createdAt: new Date(),
    };
    this.contributions.set(id, contribution);
    return contribution;
  }
}

export const storage = new MemStorage();
