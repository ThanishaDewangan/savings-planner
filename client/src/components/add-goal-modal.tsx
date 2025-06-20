import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertGoal } from "@shared/schema";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalAdded: () => void;
}

export default function AddGoalModal({ isOpen, onClose, onGoalAdded }: AddGoalModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currency: "INR" as "INR" | "USD",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const createGoalMutation = useMutation({
    mutationFn: async (data: InsertGoal) => {
      const response = await apiRequest("POST", "/api/goals", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Goal created successfully",
        description: `Your goal "${formData.name}" has been added.`,
      });
      handleClose();
      onGoalAdded();
    },
    onError: (error: any) => {
      if (error.message.includes("Validation error")) {
        // Handle validation errors
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
          title: "Error creating goal",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleClose = () => {
    setFormData({ name: "", targetAmount: "", currency: "INR" });
    setErrors({});
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Goal name is required";
    }
    
    if (!formData.targetAmount) {
      newErrors.targetAmount = "Target amount is required";
    } else {
      const amount = parseFloat(formData.targetAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.targetAmount = "Target amount must be a positive number";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createGoalMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="add-goal-description">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
          <p id="add-goal-description" className="sr-only">
            Create a new savings goal by entering a name, target amount, and currency.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="goalName">Goal Name</Label>
            <Input
              id="goalName"
              placeholder="e.g., Emergency Fund, Trip to Japan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="targetAmount">Target Amount</Label>
            <Input
              id="targetAmount"
              type="number"
              placeholder="0"
              min="1"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              className={errors.targetAmount ? "border-red-500" : ""}
            />
            {errors.targetAmount && (
              <p className="text-sm text-red-500 mt-1">{errors.targetAmount}</p>
            )}
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={(value: "INR" | "USD") => 
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={createGoalMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary hover:gradient-primary-hover text-white"
              disabled={createGoalMutation.isPending}
            >
              {createGoalMutation.isPending ? "Adding..." : "Add Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
