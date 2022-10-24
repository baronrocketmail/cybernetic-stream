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


    return columns;
}
function objectToColumnsSecondary(data) {
    let columns = []
    for(let propertyID in data) {
        let paymentsObj = data[propertyID].payments
        for(let payment in paymentsObj) {
            for(let documentID in paymentsObj[payment]) {
                let found = false
                for(let elem in columns) {
                    if (documentID === columns[elem].field) {
                        found = true
                    }
                }
                if(!found) {
                    columns.push({field: documentID,  headerName: documentID, width: 150})
                }
            }
        }
    }
    return columns
}

function getPrimaryGridDetailPanelContent(props) {
    return(
        <>
            <p>{props.row.name}</p>
            <p>{props.row.manager}</p>
        </>
    )
}



export default function Home(props) {
    const [data, setData] = useState(props.data)
    const [primaryGridRows, setPrimaryGridRows] = useState(objectToRows(data))
    const [primaryGridColumns, setPrimaryGridColumns] = useState(objectToColumns(data))

    const [secondaryGridRows, setSecondaryGridRows] = useState(getPaymentsDataset(data))
    const [secondaryGridRowsActive, setSecondaryGridRowsActive] = useState([])

    const [secondaryGridColumns, setSecondaryGridColumns] = useState(objectToColumnsSecondary(data))


    console.log(secondaryGridRows)
    console.log(secondaryGridColumns)

    function handlePrimaryGridSelectionModelChange(selectionModel) {

        let array = []
        for(let elem in selectionModel) {
            array.push(... secondaryGridRows[selectionModel[elem]])
        }

        console.log(array)

        setSecondaryGridRowsActive(array)

        return undefined;
    }

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
                rows={secondaryGridRowsActive}/>
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
            let formattedPropertyPaymentsObj = {id: propertyID + ": " + paymentID}

            for (let docID in PaymentsObj[paymentID]){ // tra

                formattedPropertyPaymentsObj[docID] = PaymentsObj[paymentID][docID]
            }
            propertyPayments.push(formattedPropertyPaymentsObj)
        }
        returnObj[propertyID] = propertyPayments
    }
    return returnObj
}


function objectToRows(data){

    let rows = []
    // Traverse the Object full of Properties
    for (let propertyID in data){
        // For each property
        let row = {id: propertyID}  // create a new row representing the property

        let propertyInfoCollection = data[propertyID].info.info

        for(let documentName in propertyInfoCollection) { // traverse the info collection
            row[documentName] = propertyInfoCollection[documentName]
        }
        rows.push(row)
    }

    return rows

}
