import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import React, { useState, useEffect } from "react";
import {
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Line,
    Tooltip,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import { format } from "date-fns";
import "./App.css";

function App() {
    const [summaryData, setSummaryData] = useState([]);
    const [discrepancies, setDiscrepancies] = useState([]);
    const [dateRange, setDateRange] = useState({
        startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
    });

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const fetchData = async () => {
        try {
            const [summaryRes, discrepancyRes] = await Promise.all([
                fetch("http://localhost:8080/transaction/reconciliation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dateRange),
                }),
                fetch(
                    `http://localhost:8080/transaction/reconciliation-discrepancy/${dateRange.startDate}`
                ),
            ]);

            const summaryData = await summaryRes.json();
            const discrepancies = await discrepancyRes.json();

            console.log("Summary Data:", summaryData);
            console.log("Discrepancies:", discrepancies);

            setSummaryData(summaryData.DT);
            setDiscrepancies(discrepancies.DT);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Reconciliation Dashboard</h1>

            {/* Date Range Selector */}
            <div className="mb-6">
                <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                        setDateRange((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                        }))
                    }
                    className="border p-2 mr-2"
                />
                <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                        setDateRange((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                        }))
                    }
                    className="border p-2"
                />
            </div>

            {/* Summary Charts */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl mb-4">Transaction Status Distribution</h2>
                    <BarChart width={500} height={300} data={summaryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl mb-4">Amount Distribution</h2>
                    <BarChart width={500} height={300} data={summaryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalAmount" fill="#82ca9d" />
                    </BarChart>
                </div>
            </div>

            {/* Discrepancy List */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl mb-4">Discrepancy Details</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Order ID</th>
                                <th className="px-4 py-2">Payment Amount</th>
                                <th className="px-4 py-2">Order Amount</th>
                                <th className="px-4 py-2">Difference</th>
                                <th className="px-4 py-2">Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discrepancies.length !== 0 ? (
                                discrepancies.map((item) => (
                                    <tr key={item._id}>
                                        <td className="border px-4 py-2">{item.orderId}</td>
                                        <td className="border px-4 py-2">
                                            {item.paymentSystemAmount}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {item.mainSystemAmount}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {item.paymentSystemAmount - item.mainSystemAmount}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {item.discrepancyReason}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No discrepancies found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default App;
