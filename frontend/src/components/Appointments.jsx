import axios from "axios";
import { useEffect, useState } from "react";
import { getApiUrl } from "../api/api";

function Appointments() {
  const [searchD, setSearchD] = useState("");
  const [searchP, setSearchP] = useState("");
  const [searchA, setSearchA] = useState("");

  const [debouncedQueryA, setDebouncedQueryA] = useState("");
  const [debouncedQueryD, setDebouncedQueryD] = useState("");
  const [debouncedQueryP, setDebouncedQueryP] = useState("");

  const [doctorsData, setDoctorsData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);

  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);

  const [date, setDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [testName, setTestName] = useState("");
  const [testResult, setTestResult] = useState("");
  const [amount, setAmount] = useState("");
  const [testLoading, setTestLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQueryD(searchD);
      setDebouncedQueryP(searchP);
      setDebouncedQueryA(searchA);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchD, searchP, searchA]);

  useEffect(() => {
    if (debouncedQueryD) searchForDoctors();
    if (debouncedQueryP) searchForPatients();
    if (debouncedQueryA) searchForAppointments();
  }, [debouncedQueryD, debouncedQueryP, debouncedQueryA]);

  const searchForDoctors = async () => {
    try {
      const res = await axios.get(
        getApiUrl(`/api/v1/doctor/searchfordoctors?search=${debouncedQueryD}`),
      );
      setDoctorsData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const searchForPatients = async () => {
    try {
      const res = await axios.get(
        getApiUrl(`/api/v1/patient/searchforpatients?search=${debouncedQueryP}`),
      );
      setPatientsData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const searchForAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        getApiUrl(`/api/v1/appointment/searchforappointments?search=${debouncedQueryA}`),
      );
      setAppointments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!doctor || !patient || !date) return;

    try {
      setBtnLoading(true);

      await axios.post(getApiUrl("/api/v1/appointment/createappointment"), {
        doc_id: doctor.id,
        pat_id: patient.id,
        date,
      });

      setDoctor(null);
      setPatient(null);
      setSearchD("");
      setSearchP("");
      setDate("");
    } catch (e) {
      console.error(e);
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(getApiUrl(`/api/v1/appointment/deleteappointment/${id}`));
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const submitTest = async () => {
    if (!testName || !testResult || !amount) return;

    try {
      setTestLoading(true);

      await axios.post(getApiUrl(`/api/v1/test/addtest`), {
        appointment_id: selectedId,
        test_name: testName,
        test_result: testResult,
        amount,
      });

      // ✅ FIXED state update
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selectedId ? { ...a, status: "Completed" } : a,
        ),
      );

      setOpen(false);
      setTestName("");
      setTestResult("");
      setAmount("");
    } catch (e) {
      console.error(e);
    } finally {
      setTestLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* TEST MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-96 p-6 rounded-xl shadow relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Add Test</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Test Name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />

              <input
                type="text"
                placeholder="Test Result"
                value={testResult}
                onChange={(e) => setTestResult(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />

              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />

              <button
                onClick={submitTest}
                disabled={testLoading || !testName || !testResult || !amount}
                className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:bg-blue-300"
              >
                {testLoading ? "Adding..." : "Add Test"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6">Appointments</h2>

        {/* FORM */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* DOCTOR */}
          <div className="relative">
            <input
              type="text"
              placeholder="Doctor name"
              value={doctor ? doctor.first_name : searchD}
              onChange={(e) => {
                setDoctor(null);
                setSearchD(e.target.value);
              }}
              className="border p-2 rounded-lg w-full"
            />

            {!doctor && searchD && (
              <div className="absolute bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto z-10">
                {doctorsData.length > 0 ? (
                  doctorsData.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setDoctor(doc);
                        setDoctorsData([]);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Dr. {doc.first_name} {doc.last_name}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500 text-sm">
                    No doctor found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PATIENT */}
          <div className="relative">
            <input
              type="text"
              placeholder="Patient name"
              value={patient ? patient.first_name : searchP}
              onChange={(e) => {
                setPatient(null);
                setSearchP(e.target.value);
              }}
              className="border p-2 rounded-lg w-full"
            />

            {!patient && searchP && (
              <div className="absolute bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto z-10">
                {patientsData.length > 0 ? (
                  patientsData.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setPatient(p);
                        setPatientsData([]);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {p.first_name} {p.last_name}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500 text-sm">
                    No patient found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DATE */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded-lg"
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={btnLoading || !doctor || !patient || !date}
          className="bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg mb-6"
        >
          {btnLoading ? "Creating..." : "Create Appointment"}
        </button>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchA}
          onChange={(e) => setSearchA(e.target.value)}
          className="border p-2 rounded-lg w-full mb-4"
        />

        {/* LIST */}
        <div className="space-y-3">
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <div
                key={appt.id}
                className="border p-4 rounded-lg flex justify-between items-center hover:shadow transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    Dr. {appt?.doctor_first_name} {appt?.doctor_last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {appt?.patient_first_name} {appt?.patient_last_name}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm text-gray-500">
                    {formatDate(appt.date)}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (appt.status === "Completed") return;
                        setOpen(true);
                        setSelectedId(appt.id);
                      }}
                      className={`px-3 py-1 text-xs rounded-full capitalize
                      ${
                        appt.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appt.status}
                    </button>

                    <button
                      onClick={() => deleteAppointment(appt.id)}
                      className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No appointments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Appointments;
