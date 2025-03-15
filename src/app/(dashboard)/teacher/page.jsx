"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useDatabase } from "@/app/context/DatabaseProvider";
import { useEffect, useState } from "react";
import Annoucement from "@/components/Annoucement";


// Dynamically import components

const BigCalendar = dynamic(() => import("@/components/BigCalendar"));
const Performance = dynamic(() => import("@/components/Performance"));

export default function TeacherPage() {
  const { databaseData } = useDatabase();
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const storedData = sessionStorage.getItem("userData");
    if (!storedData) return router.push("/sign-in");

    const parsedData = JSON.parse(storedData);
    if (parsedData.role !== "teacher" || !userId) return router.push("/sign-in");

    const foundTeacher = databaseData?.teachers?.find((t) => t.id === userId);
    if (!foundTeacher) return router.push("/sign-in");

    setTeacher(foundTeacher);
    setIsLoading(false);
  }, [userId, isLoaded, databaseData, router]);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 space-y-6 bg-purple-100 min-h-screen">
      {/* TEACHER PROFILE */}
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-6">
        <Image
          src={teacher?.img || "/noAvatar.png"}
          alt="Teacher Avatar"
          width={120}
          height={120}
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{teacher?.name || "N/A"}</h1>
          <p className="text-gray-600 text-sm">A dedicated educator fostering academic excellence.</p>
          <h3 className="text-sm font-bold">{teacher?.role || "Teacher"}</h3>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-sm text-purple-500 font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-gray-600 text-sm font-medium">First Name</h3>
            <p className="text-gray-800 font-semibold text-[14px]">{teacher?.name || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Last Name</h3>
            <p className="text-gray-800 font-semibold text-[14px]">{teacher?.surname || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Email Address</h3>
            <p className="text-gray-800 font-semibold text-[14px]">{teacher?.email || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Phone Number</h3>
            <p className="text-gray-800 font-semibold text-[14px]">{teacher?.phone || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Session</h3>
            <p className="text-gray-800 font-semibold text-[14px]">N/A</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">User Role</h3>
            <p className="text-gray-800 font-semibold text-[14px]">{teacher?.role || "Teacher"}</p>
          </div>
        </div>
      </div>

      {/* TEACHER STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <Image src="/singleAttendance.png" alt="Attendance" width={28} height={28} />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">---%</h3>
            <p className="text-sm text-gray-500">Attendance</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <Image src="/singleBranch.png" alt="Branches" width={28} height={28} />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">--</h3>
            <p className="text-sm text-gray-500">Branches</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <Image src="/singleLesson.png" alt="Lessons" width={28} height={28} />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">--</h3>
            <p className="text-sm text-gray-500">Subject</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <Image src="/singleClass.png" alt="Classes" width={28} height={28} />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">---</h3>
            <p className="text-sm text-gray-500">Classes</p>
          </div>
        </div>
      </div>

      {/* TEACHER SCHEDULE */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Teacher’s Schedule</h2>
        <BigCalendar />
      </div>

      {/* QUICK LINKS */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <Link href="/" className="p-3 rounded-md bg-gray-100 hover:bg-gray-200">Classes</Link>
          <Link href="/" className="p-3 rounded-md bg-gray-100 hover:bg-gray-200">Students</Link>
          <Link href="/" className="p-3 rounded-md bg-gray-100 hover:bg-gray-200">Lessons</Link>
          <Link href="/" className="p-3 rounded-md bg-gray-100 hover:bg-gray-200">Exams</Link>
          <Link href="/" className="p-3 rounded-md bg-gray-100 hover:bg-gray-200">Assignments</Link>
        </div>
      </div>

      {/* PERFORMANCE & ANNOUNCEMENTS */}
      <Performance />
      <Annoucement/>

          </div>
  );
}
