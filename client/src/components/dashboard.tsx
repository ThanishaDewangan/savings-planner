import { Card } from "@/components/ui/card";
import { Target, Coins, PieChart, TrendingUp } from "lucide-react";
import type { DashboardData } from "@shared/schema";

interface DashboardProps {
  data?: DashboardData;
  isLoading: boolean;
}

export default function Dashboard({ data, isLoading }: DashboardProps) {
  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatUSD = (inrAmount: string, rate: number) => {
    const num = parseFloat(inrAmount) / rate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className="gradient-primary rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center animate-pulse">
            <div className="w-5 h-5 bg-white/20 rounded mr-2"></div>
            <div className="w-32 h-5 bg-white/20 rounded"></div>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-pulse">
              <div className="w-24 h-4 bg-white/20 rounded mb-4"></div>
              <div className="w-32 h-8 bg-white/20 rounded mb-2"></div>
              <div className="w-20 h-3 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="gradient-primary rounded-2xl p-6 mb-8 text-white">
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-white/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Dashboard Loading</h3>
          <p className="text-white/80">Fetching your financial overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-primary rounded-2xl p-6 mb-8 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <TrendingUp className="mr-2" size={20} />
          Financial Overview
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Target */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Target className="text-white/80 mr-2" size={16} />
            <span className="text-sm text-white/80">Total Target</span>
          </div>
          <div className="text-2xl font-semibold">
            {formatCurrency(data.totalTarget)}
          </div>
          <div className="text-xs text-white/70 mt-1">
            Exchange Rate: 1 USD = ₹{data.exchangeRate.rate.toFixed(2)}
          </div>
        </div>

        {/* Total Saved */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Coins className="text-white/80 mr-2" size={16} />
            <span className="text-sm text-white/80">Total Saved</span>
          </div>
          <div className="text-2xl font-semibold">
            {formatCurrency(data.totalSaved)}
          </div>
          <div className="text-xs text-white/70 mt-1">
            {formatUSD(data.totalSaved, data.exchangeRate.rate)}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center mb-2">
            <PieChart className="text-white/80 mr-2" size={16} />
            <span className="text-sm text-white/80">Overall Progress</span>
          </div>
          <div className="text-2xl font-semibold">
            {data.overallProgress.toFixed(1)}%
          </div>
          <div className="text-xs text-white/70 mt-1">
            Total goal completion
          </div>
        </div>
      </div>
    </div>
  );
}
