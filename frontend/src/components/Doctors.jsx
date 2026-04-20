import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { getApiUrl } from "../api/api";

function Doctors() {
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(search);
  const [doctorsData, setDoctorsData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [dob, setDob] = useState("");
  const [department, setDepartment] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [button, setButton] = useState("add");
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedQuery) {
      searchForDoctors();
    } else {
      fetchAllDoctors();
    }
  }, [debouncedQuery]);

  const fetchAllDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(getApiUrl("/api/v1/doctor/getalldoctors"));
      setDoctorsData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const searchForDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        getApiUrl(`/api/v1/doctor/searchfordoctors?search=${debouncedQuery}`),
      );
      setDoctorsData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      setLoading(true);
      await axios.delete(getApiUrl(`/api/v1/doctor/deletedoctor/${id}`));
      setDoctorsData((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const editDoctor = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(getApiUrl(`/api/v1/doctor/editdoctor/${doctorId}`), {
        first_name: fname,
        last_name: lname,
        department,
        dob,
        experience,
        salary,
      });
      setFname("");
      setLname("");
      setDob("");
      setDepartment("");
      setExperience("");
      setSalary("");
      setDoctorId(null);
      fetchAllDoctors();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addDoctor = async () => {
    try {
      setLoading(true);
      const res = await axios.post(getApiUrl(`/api/v1/doctor/adddoctor`), {
        first_name: fname,
        last_name: lname,
        department,
        dob,
        experience,
        salary,
      });
      fetchAllDoctors();
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
              {button == "add" ? "Add Doctor" : "Edit Doctor"}
            </h2>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (button === "add") {
                  addDoctor();
                } else {
                  editDoctor();
                }
              }}
            >
              <div>
                <label className="text-sm text-gray-600">First Name</label>
                <input
                  type="text"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Last Name</label>
                <input
                  type="text"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  value={new Date(dob).toLocaleDateString("en-CA")}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                >
                  <option value="">Select Department</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="General Medicine">General Medicine</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Experience (years)
                </label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Salary</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 cursor-pointer disabled:bg-green-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg hover:bg-green-600 transition"
                disabled={
                  !fname ||
                  !lname ||
                  !dob ||
                  !department ||
                  !experience ||
                  !salary
                }
              >
                {button === "add" ? "Add Doctor" : "Update Doctor"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Doctors</h2>

          <button
            className="flex items-center gap-2  bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => {
              setIsOpen(true);
              setButton("add");
            }}
          >
            <Plus size={18} />
            Add Doctor
          </button>
        </div>

        <input
          type="text"
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="space-y-4">
          {doctorsData.length > 0 ? (
            doctorsData.map((doc) => (
              <div
                key={doc.id}
                onClick={() =>
                  setDoctorId(doctorId === doc.id ? null : doc.id)
                }
                className="p-4 border rounded-xl hover:shadow-md transition cursor-pointer bg-white relative"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-900">
                    Dr. {doc.first_name} {doc.last_name}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {doc.department}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">
                      Experience:
                    </span>{" "}
                    {doc.experience} yrs
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Salary:</span> ₹
                    {doc.salary}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Age:</span>{" "}
                    {calculateAge(doc.dob)}
                  </p>
                </div>

                {doctorId === doc.id && (
                  <div className="absolute top-3 right-3 flex gap-3 bg-white p-2 rounded-lg shadow">
                    <Pencil
                      size={18}
                      className="text-blue-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        editDoctor(doc);
                        setButton("edit");
                        setIsOpen(true);
                        setDepartment(doc.department);
                        setDob(new Date(doc.dob).toLocaleDateString("en-CA"));
                        setExperience(doc.experience);
                        setSalary(doc.salary);
                        setFname(doc.first_name);
                        setLname(doc.last_name);
                        setDoctorId(doc.id);
                      }}
                    />
                    <Trash2
                      size={18}
                      className="text-red-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDoctor(doc.id);
                      }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No doctors found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Doctors;
