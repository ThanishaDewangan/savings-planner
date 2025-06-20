import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContribution, GoalWithContributions } from "@shared/schema";

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: number | null;
  onContributionAdded: () => void;
}

export default function AddContributionModal({
  isOpen,
  onClose,
  goalId,
  onContributionAdded,
}: AddContributionModalProps) {
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const {
    data: goal,
    isLoading: goalLoading,
  } = useQuery<GoalWithContributions>({
    queryKey: ["/api/goals", goalId],
    enabled: !!goalId && isOpen,
  });

  const createContributionMutation = useMutation({
    mutationFn: async (data: InsertContribution) => {
      const response = await apiRequest("POST", "/api/contributions", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Contribution added successfully",
        description: `Your contribution of ${getCurrencySymbol()}${formData.amount} has been recorded.`,
      });
      handleClose();
      onContributionAdded();
    },
    onError: (error: any) => {
      if (error.message.includes("Validation error")) {
        try {
          const errorData = JSON.parse(error.message.split(": ")[1]);
          const fieldErrors: Record<string, string> = {};
          errorData.errors?.forEach((err: any) => {
            fieldErrors[err.path[0]] = err.message;
          });
          setErrors(fieldErrors);
        } catch {
          toast({
            title: "Validation error",
            description: "Please check your input and try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error adding contribution",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleClose = () => {
    setFormData({
      amount: "",
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!goalId) return;

    // Client-side validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount) {
      newErrors.amount = "Contribution amount is required";
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Contribution amount must be a positive number";
      }
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createContributionMutation.mutate({
      goalId,
      amount: formData.amount,
      date: formData.date,
    });
  };

  const getCurrencySymbol = () => {
    return goal?.currency === "USD" ? "$" : "₹";
  };

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

  if (!goalId || !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="add-contribution-description">
        <DialogHeader>
          <DialogTitle>Add Contribution</DialogTitle>
          {goal && (
            <p className="text-sm text-gray-500">{goal.name}</p>
          )}
          <p id="add-contribution-description" className="sr-only">
            Add a financial contribution to your savings goal by entering an amount and date.
          </p>
        </DialogHeader>

        {goalLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="contributionAmount">Contribution Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="contributionAmount"
                  type="number"
                  placeholder="0"
                  min="0.01"
                  step="0.01"
                  className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contributionDate">Date</Label>
              <Input
                id="contributionDate"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-sm text-red-500 mt-1">{errors.date}</p>
              )}
            </div>

            {goal && (
              <Card className="bg-gray-50 p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Progress:</span>
                  <span className="font-medium">
                    {formatCurrency(goal.totalSaved, goal.currency)} / {formatCurrency(goal.targetAmount, goal.currency)} ({(goal.progressPercentage || 0).toFixed(0)}%)
                  </span>
                </div>
              </Card>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={createContributionMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gradient-primary hover:gradient-primary-hover text-white"
                disabled={createContributionMutation.isPending}
              >
                {createContributionMutation.isPending ? "Adding..." : "Add Contribution"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
