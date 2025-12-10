"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function KPICard({
  title,
  value,
  change,
  icon: Icon,
  color,
  bgColor,
}) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`${bgColor} p-3 rounded-lg`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <span className="text-sm font-medium text-gray-600">{change}</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </CardContent>
    </Card>
  );
}
