"use client";

import { useEffect, useState } from "react";
import { useDatabase } from "@/app/context/DatabaseProvider";

export default function ResumptionCard() {
  const { databaseData } = useDatabase();
  const [currentResumption, setCurrentResumption] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);

  useEffect(() => {
    if (
      databaseData.sessions &&
      databaseData.terms &&
      databaseData.resumptions
    ) {
      const currentSession = databaseData.sessions.find((s) => s.isCurrent);
      const term = databaseData.terms.find((t) => t.isCurrent);
      setCurrentTerm(term);

      if (currentSession && term) {
        const resumption = databaseData.resumptions.find(
          (r) =>
            Number(r.sessionId) === Number(currentSession.id) &&
            Number(r.termId) === Number(term.id)
        );

        setCurrentResumption(resumption?.resumptionDate || null);
      }
    }
  }, [databaseData]);

  return (
    <div className="border bg-purple-400 mt-3 rounded p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-sm font-bold">RESUMPTION BOX</h1>
        <span className="text-white text-xs">
          {currentResumption
            ? new Date(currentResumption).toLocaleDateString()
            : "No date set"}
        </span>
      </div>
      <p className="text-white mt-1 text-xs">
        {currentResumption && currentTerm
          ? `${currentTerm.name} starts on ${new Date(
              currentResumption
            ).toLocaleDateString()}`
          : "No resumption date found"}
      </p>
    </div>
  );
}
