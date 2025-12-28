import React, { useState } from "react";
import { useApp } from "../context/AppContext";
const Reports = () => {
  const { trainers, attendance, getTrainerById, getSessionById } = useApp();
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getTrainerReport = (trainerId) => {
    const trainerAttendance = attendance.filter(
      (a) => a.trainerId === trainerId
    );
    const totalHours = trainerAttendance.reduce(
      (sum, a) => sum + parseFloat(a.workingHours || 0),
      0
    );
    const presentCount = trainerAttendance.filter(
      (a) => a.status === "Present"
    ).length;
    const lateCount = trainerAttendance.filter(
      (a) => a.status === "Late"
    ).length;
    const missedCount = trainerAttendance.filter(
      (a) => a.status === "Missed"
    ).length;
    const totalSessions = trainerAttendance.length;
    return {
      totalHours: totalHours.toFixed(2),
      presentCount,
      lateCount,
      missedCount,
      totalSessions,
      attendanceRate:
        totalSessions > 0
          ? ((presentCount / totalSessions) * 100).toFixed(1)
          : 0,
    };
  };

  const getFilteredAttendance = () => {
    return attendance.filter((record) => {
      const session = getSessionById(record.sessionId);
      if (!session) return false;
      if (selectedTrainer && record.trainerId !== selectedTrainer) return false;
      if (startDate && session.date < startDate) return false;
      if (endDate && session.date > endDate) return false;
      return true;
    });
  };

  const filteredAttendance = getFilteredAttendance();
  const totalHours = filteredAttendance.reduce(
    (sum, a) => sum + parseFloat(a.workingHours || 0),
    0
  );
  const present = filteredAttendance.filter(
    (a) => a.status === "Present"
  ).length;
  const late = filteredAttendance.filter((a) => a.status === "Late").length;
  const missed = filteredAttendance.filter((a) => a.status === "Missed").length;

  const handleExportCSV = () => {
    const csvData = filteredAttendance.map((record) => {
      const trainer = getTrainerById(record.trainerId);
      const session = getSessionById(record.sessionId);
      return {
        Trainer: trainer?.name,
        EmployeeID: trainer?.employeeId,
        Session: session?.name,
        Date: session?.date,
        CheckIn: record.checkInTime
          ? new Date(record.checkInTime).toLocaleString()
          : "N/A",
        CheckOut: record.checkOutTime
          ? new Date(record.checkOutTime).toLocaleString()
          : "N/A",
        Hours: record.workingHours || 0,
        Status: record.status,
        Approved: record.approved ? "Yes" : "No",
      };
    });
    const headers = Object.keys(csvData[0] || {}).join(",");
    const rows = csvData.map((row) => Object.values(row).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Reports</h1>

      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-3">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Trainer</label>
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">All Trainers</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedTrainer("");
              setStartDate("");
              setEndDate("");
            }}
            className="btn btn-outline flex-1"
          >
            Clear
          </button>
          <button onClick={handleExportCSV} className="btn btn-success flex-1">
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="card p-3 text-center">
          <p className="text-xs text-gray-600">Total Hours</p>
          <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xs text-gray-600">Present</p>
          <p className="text-2xl font-bold text-green-600">{present}</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xs text-gray-600">Late</p>
          <p className="text-2xl font-bold text-yellow-600">{late}</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xs text-gray-600">Missed</p>
          <p className="text-2xl font-bold text-red-600">{missed}</p>
        </div>
      </div>

      {filteredAttendance.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No records</p>
      ) : (
        <div className="card p-4">
          <h3 className="text-lg font-semibold mb-3">Trainer Reports</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {trainers
              .filter((t) => !selectedTrainer || t.id === selectedTrainer)
              .map((trainer) => {
                const report = getTrainerReport(trainer.id);
                if (report.totalSessions === 0) return null;
                return (
                  <div key={trainer.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="font-semibold">{trainer.name}</p>
                        <p className="text-xs text-gray-600">{trainer.skill}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold">
                          {report.attendanceRate}% Rate
                        </p>
                        <p className="text-xs text-gray-600">
                          {report.totalHours}h worked
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      Sessions: {report.presentCount}P + {report.lateCount}L +{" "}
                      {report.missedCount}M = {report.totalSessions}T
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
