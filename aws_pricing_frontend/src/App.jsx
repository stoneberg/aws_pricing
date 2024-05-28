// src/App.js
import { useState } from "react";
import Search from "./components/Search";
import Result from "./components/Results";

function App() {
  const [results, setResults] = useState([]);

  const handleSearchResults = (data) => {
    // Parse the PriceList from the response and format it for the Result component
    const formattedResults = data.map((item) => {
      const product = JSON.parse(item).product.attributes;
      const terms = JSON.parse(item).terms.OnDemand;
      const price = Object.values(terms)[0].priceDimensions;
      const pricePerHour = Object.values(price)[0].pricePerUnit.USD;

      return {
        instanceType: product.instanceType,
        location: product.location,
        operatingSystem: product.operatingSystem,
        vCPU: product.vcpu,
        memory: product.memory,
        pricePerHour: pricePerHour,
      };
    });

    setResults(formattedResults);
  };

  return (
    <div className="App">
      <Search onSearch={handleSearchResults} />
      <Result results={results} />
    </div>
  );
}

export default App;
