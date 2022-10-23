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


export default function Home(props) {
    const [data, setData] = useState(props.data)
    const [primaryGridRows, setPrimaryGridRows] = useState(objectToRows(data))
    const [primaryGridColumns, setPrimaryGridColumns] = useState([{ field: 'id', headerName: 'ID', width: 90}])


    console.log(primaryGridRows)

  return (
      <>
        <Box sx = {{height: "50vh", width: "100%"}}>
            <DataGridPremium
                columns={primaryGridColumns}
                rows={primaryGridRows}/>
        </Box>

        <div>
            <DataGridPremium
                columns={[]}
                rows={[]}/>
        </div>
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
