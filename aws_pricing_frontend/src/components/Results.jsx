// components/Result.js
import React from "react";

const Result = ({ results }) => {
  return (
    <div className="container mx-auto p-4">
      {results.length > 0 ? (
        <table className="table-auto w-full border-collapse bg-white border border-gray-300">
          <thead className="bg-pink-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">
                Instance Type
              </th>
              <th className="border border-gray-300 px-4 py-2">Location</th>
              <th className="border border-gray-300 px-4 py-2">
                Operating System
              </th>
              <th className="border border-gray-300 px-4 py-2">vCPU</th>
              <th className="border border-gray-300 px-4 py-2">Memory</th>
              <th className="border border-gray-300 px-4 py-2">
                Price per Hour (USD)
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{result.instanceType}</td>
                <td className="border px-4 py-2">{result.location}</td>
                <td className="border px-4 py-2">{result.operatingSystem}</td>
                <td className="border px-4 py-2">{result.vCPU}</td>
                <td className="border px-4 py-2">{result.memory}</td>
                <td className="border px-4 py-2">{result.pricePerHour}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-bold text-2xl">No results found</p>
      )}
    </div>
  );
};

export default Result;
