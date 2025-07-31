import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProperties } from "state";
import Property from "./PropertyWidget";

const PropertiesWidget = () => {
  const dispatch = useDispatch();
  const properties = useSelector((state) => state.properties);
  const [isLoading, setIsLoading] = useState(true);

  const getMyProperties = async () => {
    const response = await fetch(
      "http://localhost:3001/properties/myproperty",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const data = await response.json();
    dispatch(setProperties({ properties: data }));
    setIsLoading(false);
  };

  useEffect(() => {
    getMyProperties();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        properties.map((property) => (
          <Property key={property._id} property={property} />
        ))
      )}
    </div>
  );
};
export default PropertiesWidget;
