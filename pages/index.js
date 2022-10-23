import {DataGridPremium} from "@mui/x-data-grid-premium";
import {fetchAllUnits} from "./api/DataFetching";
import {useState} from "react";
import {Box} from "@mui/material";


export async function getStaticProps(){
    let data = await fetchAllUnits()
    return{
        props: {data},
        revalidate: 1
    }
}


function objectToColumns(data) {
    let columns = []


    for (let propertyID in data) {     // traverse all property keys in data
        let infoCollection = data[propertyID].info.info
        for (let documentID in infoCollection) {   // traverse all documents in info
            // for each thing in the info collection
            let found = false // in the thing has a column
            for(let elem in columns) { // for each document in info, check to see if it has a column
                console.log("id: ")

                console.log(columns[elem].field)
               if (columns[elem].field === documentID) {
                   found = true
               }
            }
            if (!found) columns.push({field: documentID, headerName: documentID, width: 200})
        }

    }

    console.log("columns data: ")
    console.log(columns)




    return columns;
}

export default function Home(props) {
    const [data, setData] = useState(props.data)
    const [primaryGridRows, setPrimaryGridRows] = useState(objectToRows(data))
    const [primaryGridColumns, setPrimaryGridColumns] = useState(objectToColumns(data))


    console.log(primaryGridRows)

  return (
      <>
        <Box sx = {{height: "50vh", width: "100%"}}>
            <DataGridPremium
                columns={primaryGridColumns}
                rows={primaryGridRows}/>
        </Box>

        <Box sx = {{height: "50vh", width: "100%"}}>
            <DataGridPremium
                columns={[]}
                rows={[]}/>
        </Box>
      </>
  )
}

function objectToRows(data){

    let rows = []
    // Traverse the Object full of Properties
    for (let propertyID in data){
        // For each property
        let row = {id: propertyID}  // create a new row representing the property
        console.log("data: ")

        console.log(data)

        let propertyInfoCollection = data[propertyID].info.info

        for(let documentName in propertyInfoCollection) { // traverse the info collection
            row[documentName] = propertyInfoCollection[documentName]
        }
        rows.push(row)
    }

    return rows

}
