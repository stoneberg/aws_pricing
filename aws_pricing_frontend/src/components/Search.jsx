import React, { useState, useEffect } from "react";
import {
  getRegions,
  getAttributes,
  getAttributeValues,
  searchProducts,
} from "../services/api";

const Search = ({ onSearch }) => {
  const [regions, setRegions] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedServiceCode, setSelectedServiceCode] = useState("AmazonEC2");
  const [filters, setFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRegions().then((response) => {
      const regionsData = response.data.map((region) => ({
        name: region.RegionName,
        endpoint: region.Endpoint,
      }));
      setRegions(regionsData);
    });
  }, []);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    getAttributes(region).then((response) => setAttributes(response.data));
  };

  const handleServiceCodeChange = (e) => {
    setSelectedServiceCode(e.target.value);
  };

  const handleFilterChange = (index, type, value) => {
    const newFilters = [...filters];
    newFilters[index][type] = value;
    setFilters(newFilters);

    if (type === "field") {
      getAttributeValues(selectedServiceCode, value, selectedRegion).then(
        (response) => {
          const newAttributeValues = {
            ...attributeValues,
            [index]: response.data,
          };
          setAttributeValues(newAttributeValues);
        }
      );
    }
  };

  const addFilter = () => {
    setFilters([...filters, { field: "", value: "" }]);
    setShowFilters(true);
  };

  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    if (newFilters.length === 0) {
      setShowFilters(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    const searchCriteria = {
      region: selectedRegion,
      serviceCode: selectedServiceCode,
      filters: filters.map((f) => ({
        Type: "TERM_MATCH",
        Field: f.field,
        Value: f.value,
      })),
    };
    searchProducts(searchCriteria).then((response) => {
      onSearch(response.data.PriceList);
      setLoading(false);
    });
  };

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-5xl font-bold text-center text-blue-500 mt-10 mb-20">
        AWS Service Search
      </h1>
      <div className="mb-4 flex items-center">
        <div className="mr-4">
          <label>Region:</label>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="border p-2 rounded ml-2"
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region.endpoint} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Service Code:</label>
          <select
            value={selectedServiceCode}
            onChange={handleServiceCodeChange}
            className="border p-2 rounded ml-2"
          >
            <option value="AmazonEC2">AmazonEC2</option>
            <option value="AmazonRDS">AmazonRDS</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <button
          onClick={addFilter}
          disabled={!selectedRegion}
          className={`w-32 px-4 py-2 rounded ${
            !selectedRegion
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Add Filter
        </button>
      </div>
      {showFilters &&
        filters.map((filter, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center">
              <select
                value={filter.field}
                onChange={(e) =>
                  handleFilterChange(index, "field", e.target.value)
                }
                className="border p-2 rounded mr-2"
              >
                <option value="">Select Field</option>
                {attributes.map((attr) => (
                  <option key={attr} value={attr}>
                    {attr}
                  </option>
                ))}
              </select>
              <select
                value={filter.value}
                onChange={(e) =>
                  handleFilterChange(index, "value", e.target.value)
                }
                className="border p-2 rounded mr-2"
              >
                <option value="">Select Value</option>
                {attributeValues[index] &&
                  attributeValues[index].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
              </select>
              <button
                onClick={() => removeFilter(index)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      <div className="mb-4 flex items-center">
        <button
          onClick={handleSearch}
          disabled={!selectedRegion}
          className={`w-32 px-4 py-2 rounded ${
            !selectedRegion
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-500 text-white"
          }`}
        >
          Search
        </button>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-xl">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
