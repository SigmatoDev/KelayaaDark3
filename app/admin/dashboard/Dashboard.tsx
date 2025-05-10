"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";
import Link from "next/link";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import useSWR from "swr";
import { formatNumber } from "@/lib/utils";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  CubeIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/20/solid";
import { IndianRupeeIcon, ShoppingCartIcon, UsersIcon } from "lucide-react";

function getLast7Days() {
  const days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD
    days.push(formatted);
  }
  return days;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
  ChartDataLabels
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/admin/summary`);

  if (error) return <div className="text-red-600">Error: {error.message}</div>;
  if (!summary)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );

  const last7Days = getLast7Days();

  const salesMap = new Map(
    summary.salesData.map((x: { _id: string; totalSales: number }) => [
      x._id,
      x.totalSales,
    ])
  );

  const ordersMap = new Map(
    summary.salesData.map((x: { _id: string; totalOrders: number }) => [
      x._id,
      x.totalOrders,
    ])
  );

  const salesData = {
    labels: last7Days,
    datasets: [
      {
        fill: true,
        label: "Sales",
        data: last7Days.map((date) => salesMap.get(date) || 0),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.4)",
      },
    ],
  };

  const ordersData = {
    labels: last7Days,
    datasets: [
      {
        fill: true,
        label: "Orders",
        data: last7Days.map((date) => ordersMap.get(date) || 0),
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.4)",
      },
    ],
  };

  const labels = summary.productsData.map((x: any) => x._id);
  const data = summary.productsData.map((x: any) => x.totalProducts);

  const productsData = {
    labels,
    datasets: [
      {
        label: "Products",
        data,
        backgroundColor: [
          "#F87171",
          "#60A5FA",
          "#FBBF24",
          "#34D399",
          "#A78BFA",
          "#F472B6",
        ],
      },
    ],
  };

  const usersData = {
    labels: summary.usersData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        label: "Users",
        borderColor: "#6366F1",
        backgroundColor: "rgba(99, 102, 241, 0.4)",
        data: summary.usersData.map(
          (x: { totalUsers: number }) => x.totalUsers
        ),
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: "top" as const,
      },
      datalabels: {
        color: "#111",
        font: {
          weight: "bold",
        },
        formatter: (value: number, ctx: any) => {
          return ` ${value}`;
        },
      },
    },
  };

  // Sales Growth Calculation
  const calculateGrowth = (
    currentMonthSales: number,
    lastMonthSales: number
  ) => {
    console.log("Current Month Sales:", currentMonthSales);
    console.log("Last Month Sales:", lastMonthSales);

    if (!lastMonthSales) return 0; // Avoid division by zero

    const growth =
      ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
    console.log("Calculated Growth Percentage:", growth);
    return growth;
  };

  const currentMonthSales =
    summary.salesData[summary.salesData.length - 1]?.totalSales || 0;
  const lastMonthSales =
    summary.salesData[summary.salesData.length - 2]?.totalSales || 0;

  const growthPercentage = calculateGrowth(currentMonthSales, lastMonthSales);

  // Orders Growth Calculation
  const calculateOrderGrowth = (
    currentMonthOrders: number,
    lastMonthOrders: number
  ) => {
    console.log("Current Month Orders:", currentMonthOrders);
    console.log("Last Month Orders:", lastMonthOrders);

    if (!lastMonthOrders) return 0; // Avoid division by zero

    const growth =
      ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;
    console.log("Calculated Order Growth Percentage:", growth);
    return growth;
  };

  const currentMonthOrders =
    summary.salesData[summary.salesData.length - 1]?.totalOrders || 0;
  const lastMonthOrders =
    summary.salesData[summary.salesData.length - 2]?.totalOrders || 0;

  const orderGrowthPercentage = calculateOrderGrowth(
    currentMonthOrders,
    lastMonthOrders
  );

  return (
    <div className="p-6 space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Sales",
            value: `₹${formatNumber(summary.ordersPrice)}`,
            link: "/admin/orders",
            icon: <IndianRupeeIcon className="h-8 w-8 text-blue-600" />,
          },
          {
            title: "Orders",
            value: summary.ordersCount,
            link: "/admin/orders",
            icon: <ShoppingCartIcon className="h-8 w-8 text-green-600" />,
          },
          {
            title: "Products",
            value: summary.productsCount,
            link: "/admin/products",
            icon: <CubeIcon className="h-8 w-8 text-yellow-600" />,
          },
          {
            title: "Users",
            value: summary.usersCount,
            link: "/admin/users",
            icon: <UsersIcon className="h-8 w-8 text-purple-600" />,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 flex items-center space-x-4 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex-shrink-0">{stat.icon}</div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">{stat.title}</div>
              <div className="text-2xl font-semibold mt-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Growth Section */}
      <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Month-on-Month Growth</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sales Growth */}
          <div className="flex-1 border rounded-xl p-4">
            <h3 className="text-md font-medium mb-2">Sales Growth</h3>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-semibold">
                {growthPercentage.toFixed(2)}%
              </div>
              {growthPercentage !== 0 && (
                <div
                  className={`h-6 w-6 ${
                    growthPercentage > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {growthPercentage > 0 ? (
                    <ArrowTrendingUpIcon className="h-6 w-6" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-6 w-6" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Orders Growth */}
          <div className="flex-1 border rounded-xl p-4">
            <h3 className="text-md font-medium mb-2">Orders Growth</h3>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-semibold">
                {orderGrowthPercentage.toFixed(2)}%
              </div>
              {orderGrowthPercentage !== 0 && (
                <div
                  className={`h-6 w-6 ${
                    orderGrowthPercentage > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {orderGrowthPercentage > 0 ? (
                    <ArrowTrendingUpIcon className="h-6 w-6" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-6 w-6" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-3">Sales Report</h2>
          <Line data={salesData} />
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-3">Orders Report</h2>
          <Line data={ordersData} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-3">Products Report</h2>
          <div className="flex items-center justify-center h-80">
            <Doughnut data={productsData} options={doughnutOptions} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-3">Users Report</h2>
          <Bar data={usersData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
