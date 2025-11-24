// src/components/Charts.jsx
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Charts() {
  const seoTrendData = [
    { month: "Jan", score: 62 },
    { month: "Feb", score: 68 },
    { month: "Mar", score: 74 },
    { month: "Apr", score: 79 },
    { month: "May", score: 82 },
    { month: "Jun", score: 88 }
  ];

  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
        SEO Performance Trend
      </h2>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={seoTrendData}
            margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#d4d4d8"
              className="dark:stroke-slate-700"
            />

            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px"
              }}
              labelStyle={{ color: "#475569" }}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
