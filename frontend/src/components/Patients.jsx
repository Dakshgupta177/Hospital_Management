import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { getApiUrl } from "../api/api";

function Patients() {
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(search);
  const [patientsData, setPatientsData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [button, setButton] = useState("add");
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedQuery) {
      searchForPatients();
    } else {
      fetchAllPatients();
    }
  }, [debouncedQuery]);

  const fetchAllPatients = async () => {
    try {
      setLoading(true);
      const res = await axios.get(getApiUrl("/api/v1/patient/getallpatients"));
      setPatientsData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const searchForPatients = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        getApiUrl(`/api/v1/patient/searchforpatients?search=${debouncedQuery}`),
      );
      setPatientsData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id) => {
    try {
      await axios.delete(getApiUrl(`/api/v1/patient/deletepatient/${id}`));
      setPatientsData((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const editPatient = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(getApiUrl(`/api/v1/patient/editpatient/${patientId}`), {
        first_name: fname,
        last_name: lname,
        dob,
        gender,
        phone_number: phoneNumber,
      });
      setFname("");
      setLname("");
      setDob("");
      setGender("");
      setPhoneNumber("");
      setPatientId(null);
      fetchAllPatients();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async () => {
    try {
      setLoading(true);
      const res = await axios.post(getApiUrl(`/api/v1/patient/addpatient`), {
        first_name: fname,
        last_name: lname,
        dob,
        gender,
        phone_number: phoneNumber,
      });
      fetchAllPatients();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) age--;

    return age;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {loading && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30">
          <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-96 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-black text-lg"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              {button == "add" ? "Add Patient" : "Edit Patient"}
            </h2>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (button === "add") {
                  addPatient();
                } else {
                  editPatient();
                }
              }}
            >
              <div>
                <label className="text-sm text-gray-600">First Name</label>
                <input
                  type="text"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Last Name</label>
                <input
                  type="text"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Others</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  value={new Date(dob).toLocaleDateString("en-CA")}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 cursor-pointer disabled:bg-green-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg hover:bg-green-600 transition"
                disabled={
                  !fname ||
                  !lname ||
                  !dob ||
                  !phoneNumber ||
                  !gender
                }
              >
                {button === "add" ? "Add Patient" : "Update Patient"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Patients</h2>

          <button
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={() => {
              setIsOpen(true);
              setButton("add");
            }}
          >
            <Plus size={18} />
            Add Patient
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-5 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Patients List */}
        <div className="space-y-4">
          {patientsData.length > 0 ? (
            patientsData.map((patient) => (
              <div
                key={patient.id}
                onClick={() =>
                  setPatientId(
                    patientId === patient.id ? null : patient.id,
                  )
                }
                className="p-4 border rounded-xl hover:shadow-md transition cursor-pointer bg-white relative"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {patient.first_name} {patient.last_name}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {patient.gender}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">Age:</span>{" "}
                    {calculateAge(patient.dob)}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Phone:</span>{" "}
                    {patient.phone_number}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">DOB:</span>{" "}
                    {new Date(patient.dob).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions (only when clicked) */}
                {patientId === patient.id && (
                  <div className="absolute top-3 right-3 flex gap-3 bg-white p-2 rounded-lg shadow">
                    <Pencil
                      size={18}
                      className="text-green-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        editPatient(patient);
                        setFname(patient.first_name);
                        setLname(patient.last_name);
                        setDob(patient.dob);
                        setGender(patient.gender);
                        setPhoneNumber(patient.phone_number);
                        setButton("edit");
                        setIsOpen(true);
                      }}
                    />
                    <Trash2
                      size={18}
                      className="text-red-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePatient(patient.id);
                      }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No patients found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Patients;
