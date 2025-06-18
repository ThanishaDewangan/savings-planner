import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { PiggyBank, RefreshCw } from "lucide-react";
import Dashboard from "@/components/dashboard";
import GoalCard from "@/components/goal-card";
import AddGoalModal from "@/components/add-goal-modal";
import AddContributionModal from "@/components/add-contribution-modal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { GoalWithContributions, DashboardData } from "@shared/schema";

export default function Home() {
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isAddContributionModalOpen, setIsAddContributionModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const { toast } = useToast();

  const {
    data: goals = [],
    isLoading: goalsLoading,
    error: goalsError,
  } = useQuery<GoalWithContributions[]>({
    queryKey: ["/api/goals"],
  });

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  const refreshRatesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/exchange-rate");
      if (!response.ok) {
        throw new Error("Failed to refresh exchange rates");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/exchange-rate"] });
      toast({
        title: "Exchange rates updated",
        description: "Latest exchange rates have been fetched successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error refreshing rates",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddContribution = (goalId: number) => {
    setSelectedGoalId(goalId);
    setIsAddContributionModalOpen(true);
  };

  const handleGoalAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
    queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    setIsAddGoalModalOpen(false);
  };

  const handleContributionAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
    queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    setIsAddContributionModalOpen(false);
  };

  if (goalsError || dashboardError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-600 mb-4">
              {goalsError?.message || dashboardError?.message || "Something went wrong"}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <PiggyBank className="text-white text-sm" size={16} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Syfe Savings Planner
                </h1>
                <p className="text-sm text-gray-500">
                  Track your financial goals and build your future
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshRatesMutation.mutate()}
                disabled={refreshRatesMutation.isPending}
                className="flex items-center space-x-2"
              >
                <RefreshCw 
                  className={`text-xs ${refreshRatesMutation.isPending ? 'animate-spin' : ''}`} 
                  size={12} 
                />
                <span>Refresh Rates</span>
              </Button>
              <div className="text-xs text-gray-500">
                {dashboardData?.exchangeRate ? (
                  <span>Last updated: {dashboardData.exchangeRate.lastUpdated}</span>
                ) : (
                  <span>Loading rates...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard */}
        <Dashboard 
          data={dashboardData} 
          isLoading={dashboardLoading} 
        />

        {/* Goals Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Your Goals</h2>
          <Button
            onClick={() => setIsAddGoalModalOpen(true)}
            className="gradient-primary hover:gradient-primary-hover text-white font-medium flex items-center space-x-2"
          >
            <span className="text-lg">+</span>
            <span>Add Goal</span>
          </Button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {goalsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-2 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </Card>
            ))
          ) : goals.length === 0 ? (
            <Card className="col-span-full p-12 text-center border-2 border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No savings goals yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first savings goal to start tracking your progress
              </p>
              <Button
                onClick={() => setIsAddGoalModalOpen(true)}
                className="gradient-primary hover:gradient-primary-hover text-white"
              >
                Add Your First Goal
              </Button>
            </Card>
          ) : (
            <>
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  exchangeRate={dashboardData?.exchangeRate?.rate || 83.5}
                  onAddContribution={() => handleAddContribution(goal.id)}
                />
              ))}
              
              {/* Add Goal Card */}
              <Card
                className="p-6 border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
                onClick={() => setIsAddGoalModalOpen(true)}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-xl">+</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Add New Goal</h3>
                  <p className="text-sm text-gray-500">
                    Create a new savings goal to track your progress
                  </p>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        onGoalAdded={handleGoalAdded}
      />

      <AddContributionModal
        isOpen={isAddContributionModalOpen}
        onClose={() => setIsAddContributionModalOpen(false)}
        goalId={selectedGoalId}
        onContributionAdded={handleContributionAdded}
      />
    </div>
  );
}
