"use client";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkClassRecordExists, createClassRecord, fetchTerms } from "@/lib/actions";

// Zod schema
const skillSchema = z.object({
  honesty: z.number().min(1).max(5),
  punctuality: z.number().min(1).max(5),
  neatness: z.number().min(1).max(5),
  tolerance: z.number().min(1).max(5),
  sports: z.number().min(1).max(5),
  debate: z.number().min(1).max(5),
  handwriting: z.number().min(1).max(5),
  attentiveness: z.number().min(1).max(5),
});

const recordSchema = z.object({
  remarks: z.record(z.string().min(3, "Remark must be at least 3 characters")),
  skills: z.record(skillSchema),
  attendance: z.record(z.number().min(0, "Attendance must be a positive number")),
  promotions: z.record(z.string().optional().nullable()),
  preferredClass: z.record(z.string().optional().nullable()),
});

const TeacherView = ({
  students,
  memoizedClasses,
  memoizedGrades,
  selectedClass,
  selectedSession,
  currentUser,
}) => {
  const teacherId = currentUser;
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classRecordExists, setClassRecordExists] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      remarks: {},
      skills: {},
      attendance: {},
      promotions: {},
      preferredClass: {},
    },
  });

  useEffect(() => {
    if (!selectedSession) return;
    const loadTerms = async () => {
      const sessionTerms = await fetchTerms(selectedSession);
      setTerms(sessionTerms);
    };
    loadTerms();
  }, [selectedSession]);

  const selectedTermObj = terms.find((term) => term.id === selectedTerm);
  const selectedTermName = selectedTermObj?.name;
  const selectedClassObj = memoizedClasses.find((cl) => cl.id === selectedClass);
  const selectedGradeObj = memoizedGrades.find((grd) => grd.id === selectedClassObj?.gradeId);
  const isJSS3 = selectedGradeObj?.name === "JSS3";
  const isThirdTerm = selectedTermName === "Third Term";

  const doSubmitResults = async (data) => {
    setLoading(true);
    try {
      const records = students.map((student) => ({
        studentId: student.id,
        teacherId,
        termId: selectedTerm,
        sessionId: selectedSession,
        classId: selectedClass,
        remark: data.remarks[student.id] || "",
        skills: data.skills[student.id] || {},
        attendance: data.attendance[student.id] || 0,
        promotion: isThirdTerm ? data.promotions[student.id] || "Not Set" : undefined,
        preferredClass:
          isThirdTerm && isJSS3 ? data.preferredClass[student.id] || "Not Selected" : undefined,
      }));

      // console.log(records)

      const response = await createClassRecord(records);
          console.log(records)

      if (!response.success) {
        toast({ description: response.error, variant: "destructive" });
      } else {
        toast({ description: "✅ CLASS RECORD saved successfully", variant: "success" });
      }
    } catch (error) {
      console.error("Error saving class record:", error.message);
      toast({ description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedTerm || !selectedSession || !selectedClass) {
      toast({
        description: "Please select a session, term, and class before saving.",
        variant: "destructive",
      });
      return;
    }
    if (!confirmationChecked) {
      setShowConfirmModal(true);
      return;
    }
    await doSubmitResults(data);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-800">📘 Student Performance</h2>

      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700">Select Term</label>
        <select
          className="border p-2 w-full mt-1 rounded-md focus:ring-2 focus:ring-blue-500"
          value={selectedTerm || ""}
          onChange={(e) => setSelectedTerm(parseInt(e.target.value, 10))}
        >
          <option value="">-- Select Term --</option>
          {terms.map((term) => (
            <option key={term.id} value={term.id}>
              {term.name}
            </option>
          ))}
        </select>
      </div>

      {classRecordExists && (
        <div className="p-3 mb-4 text-red-800 bg-red-200 border border-red-300 rounded-md">
          This class already has submitted records for this term.
        </div>
      )}

      <div className="overflow-x-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Remark</th>
                <th className="p-3 text-left">Skill Grade</th>
                <th className="p-3 text-left">Attendance</th>
                {isThirdTerm && <th className="p-3 text-left">Promotion</th>}
                {isThirdTerm && isJSS3 && <th className="p-3 text-left">Preferred Class</th>}
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student,i) => (
                  <tr key={student.id} className="border border-gray-400 p-3">
                    <td className="border border-gray-400 p-3">{i + 1}</td>
                    <td className="p-3">{`${student.surname} ${student.firstname}`}</td>

                    {/* Remark */}
                    <td className="border border-gray-400 p-3">
                      <input
                        type="text"
                        className={`border p-2 w-full rounded-md focus:ring-2 focus:ring-indigo-500 ${
                          errors.remarks?.[student.id] ? "border-red-500" : ""
                        }`}
                        {...register(`remarks.${student.id}`)}
                      />
                      {errors.remarks?.[student.id] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.remarks[student.id].message}
                        </p>
                      )}
                    </td>

                    {/* Skills */}
                    <td className="border border-gray-400 p-3">
                      <div className="flex flex-wrap gap-4">
                        {[
                          "honesty",
                          "punctuality",
                          "neatness",
                          "tolerance",
                          "sports",
                          "debate",
                          "handwriting",
                          "attentiveness",
                        ].map((skill) => (
                          <div key={skill} className="flex flex-col">
                            <label className="text-xs font-medium capitalize text-gray-700">
                              {skill}
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={5}
                              className="w-1/2 border rounded-md p-1 text-center text-sm"
                              {...register(`skills.${student.id}.${skill}`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="border border-gray-400 p-3">
                      <input
                        type="number"
                        className={`border p-2 w-20 rounded-md focus:ring-2 focus:ring-indigo-500 ${
                          errors.attendance?.[student.id] ? "border-red-500" : ""
                        }`}
                        {...register(`attendance.${student.id}`, { valueAsNumber: true })}
                      />
                      {errors.attendance?.[student.id] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.attendance[student.id].message}
                        </p>
                      )}
                    </td>

                    {/* Promotion */}
                    {isThirdTerm && (
                      <td className="p-3">
                        <select
                          className={`border p-2 w-full rounded-md ${
                            errors.promotions?.[student.id] ? "border-red-500" : ""
                          }`}
                          {...register(`promotions.${student.id}`)}
                        >
                          <option value="">Select status</option>
                          <option value="PROMOTED">Promoted</option>
                          <option value="REPEATED">Repeat</option>
                        </select>
                      </td>
                    )}

                    {/* Preferred Class */}
                    {isThirdTerm && isJSS3 && (
                      <td className="p-3">
                        <select
                          className={`border p-2 w-full rounded-md ${
                            errors.preferredClass?.[student.id] ? "border-red-500" : ""
                          }`}
                          {...register(`preferredClass.${student.id}`)}
                        >
                          <option value="">Select class</option>
                          <option value="SSS1A">SSS1 A</option>
                          <option value="SSS1B">SSS1 B</option>
                          <option value="SSS1C">SSS1 C</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-gray-500 text-center p-4">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-6 flex gap-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              type="button"
              disabled={loading}
              onClick={() => setShowConfirmModal(true)}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Submission</h2>
            <p className="mb-4">
              Are you sure you want to submit this class result? Once submitted, you won't be able
              to edit it.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="modalConfirm"
                checked={confirmationChecked}
                onChange={(e) => setConfirmationChecked(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="modalConfirm" className="text-sm text-gray-700">
                I agree
              </label>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmationChecked(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={async () => {
                  if (!confirmationChecked) {
                    toast({
                      description: "Please check the confirmation box.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setShowConfirmModal(false);
                  await handleSubmit(onSubmit)();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherView;
