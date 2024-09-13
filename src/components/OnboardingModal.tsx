import { useState } from "react";

type Step = "personalInfo" | "financialGoals" | "riskTolerance";

export default function OnboardingModal({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState<Step>("personalInfo");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    income: "",
    savingsGoal: "",
    timeHorizon: "",
    riskTolerance: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === "personalInfo") setStep("financialGoals");
    else if (step === "financialGoals") setStep("riskTolerance");
    else onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {step === "personalInfo" && "Personal Information"}
          {step === "financialGoals" && "Financial Goals"}
          {step === "riskTolerance" && "Risk Tolerance"}
        </h2>
        {step === "personalInfo" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="number"
              name="income"
              placeholder="Annual Income"
              value={formData.income}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
            />
          </>
        )}
        {step === "financialGoals" && (
          <>
            <input
              type="number"
              name="savingsGoal"
              placeholder="Savings Goal"
              value={formData.savingsGoal}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="number"
              name="timeHorizon"
              placeholder="Time Horizon (years)"
              value={formData.timeHorizon}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
            />
          </>
        )}
        {step === "riskTolerance" && (
          <select
            name="riskTolerance"
            value={formData.riskTolerance}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded">
            <option value="">Select Risk Tolerance</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        )}
        <button
          onClick={nextStep}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {step === "riskTolerance" ? "Complete" : "Next"}
        </button>
      </div>
    </div>
  );
}
