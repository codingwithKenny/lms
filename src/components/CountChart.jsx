"use client";

import Image from "next/image";
import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const CountChart = ({ boys, girls }) => {
  // Prepare data for the chart
  const total = boys + girls;
  
  const data = [
    {
      name: "Total",
      counts: total,
      fill: "#ffffff",
    },
    {
      name: "Boys",
      counts: boys,
      fill: "#C3EBFA",
    },
    {
      name: "Girls",
      counts: girls,
      fill: "#FAE27C",
    },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-[260px] p-2">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-gray-500 text-sm">
          STUDENTS
        </h1>
        <Image src={"/moreDark.png"} alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="w-full h-[65%] relative">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar
              label={{ position: "insideStart", fill: "#fff" }}
              background
              dataKey="counts"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src={"/maleFemale.png"}
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* GENDER COUNT */}
      <div className="flex justify-center items-center gap-8">
        <div className="flex flex-col gap-1 items-center">
          <div className="rounded-full w-5 h-5 bg-[#C3EBFA]"></div>
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-gray-300 text-xs">
            Boys ({((boys / total) * 100).toFixed(1)}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="rounded-full w-5 h-5 bg-[#FAE27C]"></div>
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-gray-300 text-xs">
            Girls ({((girls / total) * 100).toFixed(1)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
