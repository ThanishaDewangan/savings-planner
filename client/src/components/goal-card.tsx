import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import type { GoalWithContributions } from "@shared/schema";

interface GoalCardProps {
  goal: GoalWithContributions;
  exchangeRate: number;
  onAddContribution: () => void;
}

export default function GoalCard({ goal, exchangeRate, onAddContribution }: GoalCardProps) {
  const formatCurrency = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    if (currency === "USD") {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(num);
    } else {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(num);
    }
  };

  const getConvertedAmount = (amount: string, fromCurrency: string) => {
    const num = parseFloat(amount);
    if (fromCurrency === "USD") {
      return formatCurrency((num * exchangeRate).toString(), "INR");
    } else {
      return formatCurrency((num / exchangeRate).toString(), "USD");
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (percentage >= 50) return "bg-gradient-to-r from-blue-500 to-indigo-500";
    if (percentage >= 25) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-gray-400 to-gray-500";
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{goal.name}</h3>
          <div className="text-sm text-gray-500">
            {goal.progressPercentage.toFixed(0)}%
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(goal.targetAmount, goal.currency)}
          </div>
          <div className="text-sm text-gray-500">
            {getConvertedAmount(goal.targetAmount, goal.currency)}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            {formatCurrency(goal.totalSaved, goal.currency)} saved
          </span>
        </div>
        <Progress 
          value={goal.progressPercentage} 
          className="h-2"
        />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>
          {goal.contributions.length} contribution{goal.contributions.length !== 1 ? 's' : ''}
        </span>
        <span>
          {formatCurrency(goal.remaining, goal.currency)} remaining
        </span>
      </div>

      <Button
        variant="outline"
        className="w-full hover:bg-gray-100 flex items-center justify-center space-x-2"
        onClick={onAddContribution}
      >
        <Plus size={16} />
        <span>Add Contribution</span>
      </Button>
    </Card>
  );
}
