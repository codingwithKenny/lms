"use client";

import { useDatabase } from "@/app/context/DatabaseProvider";
import { toast } from "@/hooks/use-toast";
import { saveResumptionDate, updateResumptionDate } from "@/lib/actions";
import React, { useState, useEffect } from "react";

const ResumptionDate = () => {
  const { databaseData } = useDatabase();
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [resumptionDate, setResumptionDate] = useState("");

  const allSessions = databaseData.sessions;
  const relatedTerms = selectedSession
    ? databaseData.terms.filter(
        (t) => Number(t.sessionId) === Number(selectedSession)
      )
    : [];

  useEffect(() => {
    if (
      selectedSession &&
      selectedTerm &&
      Array.isArray(databaseData.resumptions)
    ) {
      const record = databaseData.resumptions.find(
        (r) =>
          Number(r.sessionId) === Number(selectedSession) &&
          Number(r.termId) === Number(selectedTerm)
      );
      setResumptionDate(record?.date || "");
    }
  }, [selectedSession, selectedTerm, databaseData.resumptions]);

  const handleSave = async () => {
    try {
      // Ensure all necessary fields are filled
      if (!selectedSession || !selectedTerm || !resumptionDate) {
        throw new Error("Please fill in all the required fields.");
      }
  
      const existing = databaseData.resumptions.find(
        (r) =>
          Number(r.sessionId) === Number(selectedSession) &&
          Number(r.termId) === Number(selectedTerm)
      );
  
      const action = existing ? updateResumptionDate : saveResumptionDate;
  
      const payload = {
        sessionId: selectedSession,
        termId: selectedTerm,
        resumptionDate,
      };
  
      console.log("Payload being sent:", payload); // Debugging the payload
  
      const response = await action(payload);
  
      if (response.success) {
        toast({
          description: response.message || "Resumption date saved.",
        });
      } else {
        throw new Error(response.message || "Failed to save date.");
      }
    } catch (err) {
      toast({
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
      console.error(err);
    }
  };
  

  return (
    <div className="bg-purple-100 p-6">
      <div className="flex flex-wrap gap-4 bg-white shadow-md rounded-lg p-6 items-end">
        {/* Session */}
        <div className="flex flex-col w-1/3">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Select Session
          </label>
          <select
            className="p-2 border rounded"
            value={selectedSession || ""}
            onChange={(e) => {
              setSelectedSession(parseInt(e.target.value, 10));
              setSelectedTerm(null);
              setResumptionDate("");
            }}
          >
            <option value="">-- Select Session --</option>
            {allSessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Term */}
        <div className="flex flex-col w-1/3">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Select Term
          </label>
          <select
            className="p-2 border rounded"
            value={selectedTerm || ""}
            onChange={(e) => {
              setSelectedTerm(parseInt(e.target.value, 10));
              setResumptionDate("");
            }}
          >
            <option value="">-- Select Term --</option>
            {relatedTerms.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div className="flex flex-col w-1/3">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Resumption Date
          </label>
          <input
            type="date"
            className="p-2 border rounded"
            value={resumptionDate}
            onChange={(e) => setResumptionDate(e.target.value)}
          />
        </div>
      </div>

      {selectedSession && selectedTerm && (
        <div className="mt-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleSave}
          >
            Save Resumption Date
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumptionDate;
