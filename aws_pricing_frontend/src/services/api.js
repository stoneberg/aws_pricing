// services/api.js
import axios from "axios";

const baseUrl = "http://localhost:3000";

export const getRegions = () => axios.get(`${baseUrl}/aws-regions`);

export const getAttributes = (region) =>
  axios.get(`${baseUrl}/aws-service-attributes?region=${region}`);

export const getAttributeValues = (serviceCode, attributeName, region) =>
  axios.get(
    `${baseUrl}/aws-attribute-values?service_code=${serviceCode}&attribute_name=${attributeName}&region=${region}`
  );

export const searchProducts = (data) => axios.post(`${baseUrl}/search`, data);
