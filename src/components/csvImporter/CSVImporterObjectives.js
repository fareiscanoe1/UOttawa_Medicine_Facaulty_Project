import React, { useState } from 'react';
import Papa from 'papaparse';

import { getObjectiveHeadingByCode, addNewLearningObjective } from "../../services/LearningObjectiveServices";

function CSVImporter() {
    const [json, setJson] = useState(null);
    const [error, setError] = useState(null);
    const [errorIndexes, setErrorIndexes] = useState([])
    const [loading,setLoading] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("No file selected");
      return;
    }

    // Check if the file type is CSV
    if (file.type !== 'text/csv') {
      setError("Please select a CSV file");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      Papa.parse(text, {
        header: true, // Treat the first row as headers
        dynamicTyping: true, // Automatically detect numbers
        skipEmptyLines: true, // Skip empty lines
        complete: async (result) => {
          setLoading("Initializing...")
          setJson(result.data);
          let count = 0
          const length = result.data.length
          const promises = result.data.map(async (rowData) => {
            try {
                const response =  await getObjectiveHeadingByCode(rowData.Code)
                if (response.status === 200) {
                    const result = response.text();
                    console.log("An Objective Heading Has Been Found For This Code: ", result);
                    if (result === rowData["Objectives Heading"]){
                        count+=1
                    } 
                    else
                    {
                        setErrorIndexes(errorIndexes.append[rowData])
                    }
                }
                if (response.status === 204) { // the heading does not exist
                    count+=1
                } 
                else {
                    console.log(rowData.Code)
                    setErrorIndexes(errorIndexes.append[rowData])
                }
                
            } catch (e) {
                console.log(e);
                setError(error+ e)
            }
          });
      
          // Wait for all promises to resolve
          await Promise.all(promises);
          console.log(count)
          
          let index = 0
          setLoading(`Loading... ${index}%`)
          if (count === length){
            const promises = result.data.map(async (rowData) => {
                index+=1
                try {
                    await new Promise((resolve) => setTimeout(resolve,1000 * index))
                    // console.log(rowData.Code)
                    const temp = new FormData();
                    temp.append("objectiveCode",rowData.Code);
                    temp.append("objectiveHeading",rowData.ObjectivesHeading);
                    temp.append("objectiveNumber",rowData.Objectives);
                    temp.append("description",rowData["Delivery: Clinical exposure Topic:"]);
                    temp.append("facultyRole", rowData["Faculty Role"]);
                    temp.append("fields", rowData.Fields);
                    temp.append("objectiveType", rowData["Objective Type"]);
                    console.log(rowData)
                    const response =  await addNewLearningObjective(temp)
                    setLoading(`Loading... ${index/count * 100}%`)
                    
                    
                } catch (e) {
                    console.log(e);
                    setError(error+ e)
                }
                
              });
              await Promise.all(promises);
              setLoading("Complete")
          }
        },
        error: (parseError) => {
          setError("Error parsing CSV file");
        },
      });
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {loading && <p>{loading}</p>}
      {error && <p>{error}</p>}
     
    </div>
  );
}

export default CSVImporter