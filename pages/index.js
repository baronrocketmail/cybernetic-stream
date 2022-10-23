import {DataGridPremium, GridToolbar} from "@mui/x-data-grid-premium";
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
            if (!found) {
                if (documentID == "monthly price") {
                    columns.push({field: documentID, headerName: documentID, width: 200, editable: true, type: "number"})
                } else {
                    columns.push({field: documentID, headerName: documentID, width: 200, editable: true})

                }

            }
        }

    }

    console.log("columns data: ")
    console.log(columns)




    return columns;
}


function getPrimaryGridDetailPanelContent(props) {
    return(
        <>
            <p>{props.row.name}</p>
            <p>{props.row.manager}</p>
        </>
    )
}

function handlePrimaryGridSelectionModelChange(selectionModel) {
    console.log(selectionModel)
    alert(selectionModel)
    return undefined;
}


export default function Home(props) {
    const [data, setData] = useState(props.data)
    const [primaryGridRows, setPrimaryGridRows] = useState(objectToRows(data))
    const [primaryGridColumns, setPrimaryGridColumns] = useState(objectToColumns(data))

    const [secondaryGridRows, setSecondaryGridRows] = useState(getPaymentsDataset(data))
    const [secondaryGridColumns, setSecondaryGridColumns] = useState([])


    console.log(primaryGridRows)

  return (
      <>
        <Box sx = {{height: "100vh", width: "100%"}}>
            <DataGridPremium
                rowReordering
                components={{ Toolbar: GridToolbar }}
                getDetailPanelHeight= {() => "auto"}
                getDetailPanelContent = {getPrimaryGridDetailPanelContent}
                experimentalFeatures={{aggregation: true, newEditingApi: true}}
                checkboxSelection
                onSelectionModelChange={(selectionModel) => handlePrimaryGridSelectionModelChange(selectionModel)}
                columns={primaryGridColumns}
                rows={primaryGridRows}/>
        </Box>

        <Box sx = {{height: "50vh", width: "100%"}}>
            <DataGridPremium
                components={{ Toolbar: GridToolbar }}
                rowReordering
                experimentalFeatures={{aggregation: true}}
                checkboxSelection
                columns={secondaryGridColumns}
                rows={secondaryGridRows}/>
        </Box>
      </>
  )
}
function getPaymentsDataset(data){
    let returnObj = {}
    for (let propertyID in data) {  // for each property,
        let PaymentsObj = data[propertyID].payments  // get the payments object
        let propertyPayments = []
        for(let paymentID in PaymentsObj){   // traverse each payment for the property
            let formattedPropertyPaymentsObj = {id: paymentID}

            for (let docID in PaymentsObj[paymentID]){ // tra

                formattedPropertyPaymentsObj[docID] = PaymentsObj[paymentID][docID]
            }
            propertyPayments.push(formattedPropertyPaymentsObj)
        }
        returnObj[propertyID] = propertyPayments
    }
    console.log(2398)
    console.log(returnObj)
    return returnObj
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
