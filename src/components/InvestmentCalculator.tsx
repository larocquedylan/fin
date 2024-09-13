"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Component() {
  const [isGoalBased, setIsGoalBased] = useState(true);
  const [initialInvestment, setInitialInvestment] = useState(1000);
  const [investmentAmount, setInvestmentAmount] = useState(100);
  const [frequency, setFrequency] = useState("monthly");
  const [period, setPeriod] = useState(8);
  const [periodUnit, setPeriodUnit] = useState("months");
  const [growthRate, setGrowthRate] = useState(0);
  const [goalAmount, setGoalAmount] = useState(4000);
  const [finalWorth, setFinalWorth] = useState(0);
  const [chartData, setChartData] = useState([]);

  const calculateInvestment = (initial: number, regular: number, months: number) => {
    let total = initial;
    let monthlyData = [];
    const periodsPerYear = frequency === "weekly" ? 52 : frequency === "monthly" ? 12 : 1;
    const periodicRate = growthRate / 100 / 12;

    for (let month = 0; month <= months; month++) {
      if (month > 0) {
        const periodsThisMonth = frequency === "weekly" ? 4 : frequency === "monthly" ? 1 : 1 / 12;
        for (let i = 0; i < periodsThisMonth; i++) {
          total = total * (1 + periodicRate) + regular;
        }
      }
      monthlyData.push({ month, value: Math.round(total) });
    }

    return { finalValue: Math.round(total), chartData: monthlyData };
  };

  const calculateRequiredInvestment = () => {
    const months = periodUnit === "years" ? period * 12 : period;
    const periodicRate = growthRate / 100 / 12;
    const periodsPerMonth = frequency === "weekly" ? 4 : frequency === "monthly" ? 1 : 1 / 12;

    // Function to calculate final value given initial and regular investments
    const calculateFinalValue = (initial, regular) => {
      let total = initial;
      for (let i = 0; i < months; i++) {
        total = total * (1 + periodicRate) + regular * periodsPerMonth;
      }
      return total;
    };

    // Binary search to find the required regular investment
    let low = 0;
    let high = goalAmount;
    let mid;
    while (high - low > 0.01) {
      mid = (low + high) / 2;
      const finalValue = calculateFinalValue(initialInvestment, mid);
      if (finalValue < goalAmount) {
        low = mid;
      } else {
        high = mid;
      }
    }

    const requiredRegular = Math.round(mid * 100) / 100;
    setInvestmentAmount(requiredRegular);

    const { finalValue, chartData } = calculateInvestment(
      initialInvestment,
      requiredRegular,
      months
    );
    setFinalWorth(finalValue);
    setChartData(chartData);
  };

  useEffect(() => {
    if (isGoalBased) {
      calculateRequiredInvestment();
    } else {
      const months = periodUnit === "years" ? period * 12 : period;
      const { finalValue, chartData } = calculateInvestment(
        initialInvestment,
        investmentAmount,
        months
      );
      setFinalWorth(finalValue);
      setChartData(chartData);
    }
  }, [
    isGoalBased,
    initialInvestment,
    investmentAmount,
    frequency,
    period,
    periodUnit,
    growthRate,
    goalAmount,
  ]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Frontier Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Switch id="goal-based" checked={isGoalBased} onCheckedChange={setIsGoalBased} />
          <Label htmlFor="goal-based">Goal-based Calculation</Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {isGoalBased && (
            <div>
              <Label htmlFor="goalAmount">Mission Target ($)</Label>
              <Input
                id="goalAmount"
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(Number(e.target.value))}
              />
            </div>
          )}
          <div>
            <Label htmlFor="initialInvestment">Ignition Grant ($)</Label>
            <Input
              id="initialInvestment"
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="investmentAmount">Fuel Payload ($)</Label>
            <Input
              id="investmentAmount"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              readOnly={isGoalBased}
            />
          </div>
          <div>
            <Label htmlFor="frequency">Fuel Injection Rate</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="period"> Trip Duration </Label>
            <div className="flex space-x-2">
              <Input
                id="period"
                type="number"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="w-2/3"
              />
              <Select value={periodUnit} onValueChange={setPeriodUnit} className="w-1/3">
                <SelectTrigger id="periodUnit">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="growthRate">Propolsion Rate (%)</Label>
            <Input
              id="growthRate"
              type="number"
              value={growthRate}
              onChange={(e) => setGrowthRate(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            {isGoalBased ? "Projected Final Amount" : "Final Investment Worth"}
          </h3>
          <p className="text-3xl font-bold text-green-600">${finalWorth.toLocaleString()}</p>
          {isGoalBased && (
            <p className="text-lg mt-2">
              Required {frequency} investment:{" "}
              <span className="font-bold text-green-600">${investmentAmount.toLocaleString()}</span>
            </p>
          )}
        </div>

        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{
                  value: periodUnit === "years" ? "Years" : "Months",
                  position: "insideBottomRight",
                  offset: 0,
                }}
                tickFormatter={(value) => (periodUnit === "years" ? Math.floor(value / 12) : value)}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, "Value"]}
                labelFormatter={(label) => `${periodUnit === "years" ? "Year" : "Month"} ${label}`}
              />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
