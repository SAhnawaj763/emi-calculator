import React, { useState, useEffect } from 'react';
import { Calculator, IndianRupee, Calendar, PieChart } from 'lucide-react';

interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

function App() {
  const [loanAmount, setLoanAmount] = useState<number>(10000); // Changed default to 10k
  const [interestRate, setInterestRate] = useState<number>(8.5); // Updated to typical Indian interest rate
  const [loanTerm, setLoanTerm] = useState<number>(2); // Common loan term in India
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [schedule, setSchedule] = useState<PaymentSchedule[]>([]);

  // Format number to Indian currency format
  const formatIndianCurrency = (amount: number) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  };

  const calculateLoan = () => {
    const monthlyRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPmt = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    setMonthlyPayment(monthlyPmt);
    
    let balance = loanAmount;
    const newSchedule: PaymentSchedule[] = [];
    let totalInt = 0;

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPmt - interestPayment;
      balance -= principalPayment;
      totalInt += interestPayment;

      newSchedule.push({
        month,
        payment: monthlyPmt,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: balance > 0 ? balance : 0
      });
    }

    setTotalInterest(totalInt);
    setSchedule(newSchedule);
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Calculator className="w-8 h-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-800">EMI Calculator</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Amount (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  step="0.1"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Term (years)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-orange-600 font-medium">Monthly EMI</p>
                <p className="text-3xl font-bold text-orange-700">
                  {formatIndianCurrency(monthlyPayment)}
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-red-600 font-medium">Total Interest</p>
                <p className="text-3xl font-bold text-red-700">
                  {formatIndianCurrency(totalInterest)}
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-600 font-medium">Total Payment</p>
                <p className="text-3xl font-bold text-yellow-700">
                  {formatIndianCurrency(monthlyPayment * loanTerm * 12)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization Schedule */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold">Repayment Schedule</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedule.slice(0, 12).map((payment) => (
                  <tr key={payment.month}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatIndianCurrency(payment.payment)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatIndianCurrency(payment.principal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatIndianCurrency(payment.interest)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatIndianCurrency(payment.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;