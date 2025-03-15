"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Dynamically import components
const Announcement = dynamic(() => import("@/components/Annoucement"));
const BigCalendar = dynamic(() => import("@/components/BigCalendar"));
const Performance = dynamic(() => import("@/components/Performance"));

const RenderTeachersPage = ({ teacher, term, latestSession }) => {
  return (
    <div className="p-6 space-y-6 bg-purple-100 min-h-screen">
      {/* TEACHER PROFILE */}
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-6">
        {/* TEACHER IMAGE */}
        <Image
          src={teacher.img || "/noAvatar.png"}
          alt="Teacher Avatar"
          width={120}
          height={120}
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800">{teacher.name}</h1>
          <p className="text-gray-600 text-sm">A dedicated educator fostering academic excellence.</p>
          <h3 className="text-sm font-bold">{teacher.role || "Teacher"}</h3>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-sm text-purple-500 font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-gray-600 text-sm font-medium">First Name</h3>
            <p className="text-gray-800 font-semibold text-[14px]">{teacher.name || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Last Name</h3>
            <p className="text-gray-800 font-semibold text-[14px]">{teacher.surname || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Email Address</h3>
            <p className="text-gray-800 font-semibold text-[14px]">{teacher.email || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Phone Number</h3>
            <p className="text-gray-800 font-semibold text-[14px]">{teacher.phone || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Session</h3>
            <p className="text-gray-800 font-semibold text-[14px]">{latestSession?.name || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Current Term</h3>
            <p className="text-gray-800 font-semibold text-[14px]">{term?.name || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* TEACHER SCHEDULE */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Teacher’s Schedule</h2>
        <BigCalendar />
      </div>

      {/* PERFORMANCE & ANNOUNCEMENTS */}
      <Performance />
      <Announcement />
    </div>
  );
};

export default RenderTeachersPage;
