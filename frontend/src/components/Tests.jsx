import axios from "axios";
import { useEffect, useState } from "react";
import { getApiUrl } from "../api/api";

function Tests() {
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(search);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedQuery) {
      searchForTests();
    } else {
      setTests([]);
    }
  }, [debouncedQuery]);

  const togglePaid = async (id) => {
    try {
      await axios.patch(getApiUrl(`/api/v1/billing/completebilling/${id}`));

      setTests((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: t.status === "Paid" ? "Unpaid" : "Paid" }
            : t
        )
      );
    } catch (error) {
      console.error("Error toggling paid status:", error);
    }
  };

  const searchForTests = async () => {
    try {
      const res = await axios.get(
        getApiUrl(`/api/v1/test/searchfortests?search=${debouncedQuery}`)
      );
      setTests(res.data);
      console.log(res.data);
      
    } catch (error) {
      console.error("Error searching for tests:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tests</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by patient / doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* List */}
        <div className="space-y-3">
          {tests.length > 0 ? (
            tests.map((test) => (
              <div
                key={test.id}
                className="p-4 border rounded-lg flex justify-between items-center hover:shadow-sm transition"
              >
                {/* LEFT */}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {test.patient_first_name} {test.patient_last_name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    Dr. {test.doctor_first_name}{" "}
                    {test.doctor_last_name}
                  </p>

                  <p className="text-sm mt-1 text-gray-700">
                    {test.test_name} — {test.test_result}
                  </p>

                  <p className="text-xs text-gray-500">
                    ₹ {test.amount}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      test.status === "Paid"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {test.status}
                  </p>

                  <button
                    onClick={() => togglePaid(test.id)}
                    className={`mt-1 text-xs bg-blue-500 cursor-pointer text-white px-2 py-1 rounded ${test.status === "Paid" ? "hidden" : ""}`}
                  >
                    Pay
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No tests found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tests;