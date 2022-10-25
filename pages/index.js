import {DataGridPremium, GridToolbar, useGridApiRef, useGridApiContext} from "@mui/x-data-grid-premium";
import {fetchAllUnits, uploadNewCellState, uploadStateChange, getPrimaryGridState} from "./api/DataFetching.mjs";
import React, {createContext, useContext, useState} from "react";
import {Box, ThemeProvider, createTheme, colors} from "@mui/material";
import {objectToRows,objectToColumns,getPaymentsDataset, objectToColumnsSecondary} from "./api/dataTransformations"
import { GridApi } from '@mui/x-data-grid-premium';

export async function getStaticProps(){
    let initialPrimaryGridState = await getPrimaryGridState()
    let data = await fetchAllUnits()
    return{
        props: {data, initialPrimaryGridState},
        revalidate: 1
    }
}

const theme = createTheme({
    palette: {
        primary:{
            main: colors.orange[900],
        },
    },
    typography : {
        fontFamily: ["Goldman Sans"],
    },
})

const PrimaryGridColumnsContext = createContext({})
const PrimaryGridRowsContext = createContext({})
const SecondaryGridColumnsContext = createContext({})
const SecondaryGridRowsContext = createContext({})
const PaymentsDatasetContext = createContext({})


export default function Home(props) {
    console.log(props.initialPrimaryGridState)

    const [data, setData] = useState(props.data)
    const [paymentsDataset, setPaymentsDataset] = useState(getPaymentsDataset(data))
    const [primaryGridColumns, setPrimaryGridColumns] = useState(objectToColumns(data))
    const [primaryGridRows, setPrimaryGridRows] = useState(objectToRows(data))
    const [secondaryGridColumns, setSecondaryGridColumns] = useState(objectToColumnsSecondary(data))
    const [secondaryGridRows, setSecondaryGridRows] = useState([])

    return (
        <>
            <ThemeProvider theme={theme}>
                <PrimaryGridColumnsContext.Provider value = {{primaryGridColumns, setPrimaryGridColumns}}>
                <PrimaryGridRowsContext.Provider value = {{primaryGridRows, setPrimaryGridRows}}>
                <SecondaryGridColumnsContext.Provider value = {{secondaryGridColumns, setSecondaryGridColumns}}>
                <SecondaryGridRowsContext.Provider value = {{secondaryGridRows, setSecondaryGridRows}}>
                <PaymentsDatasetContext.Provider value = {{paymentsDataset, setPaymentsDataset}}>
                <PrimaryGrid initialState = {props.initialPrimaryGridState}/>
                <SecondaryGrid/>
                </PaymentsDatasetContext.Provider>
                </SecondaryGridRowsContext.Provider>
                </SecondaryGridColumnsContext.Provider>
                </PrimaryGridRowsContext.Provider>
                </PrimaryGridColumnsContext.Provider>
            </ThemeProvider>
            <p>flsadk;jfalkjdfklfjaslfjalskj</p>
        </>
    )
}

 function SecondaryGrid(props){

     const columnsObj = useContext(SecondaryGridColumnsContext)
     const rowsObj = useContext(SecondaryGridRowsContext)

     return(
         <Box sx={{height: "100vh", width: "100%"}}>
             <DataGridPremium
                 components={{Toolbar: GridToolbar}}
                 rowReordering
                 experimentalFeatures={{aggregation: true}}
                 checkboxSelection
                 columns={columnsObj.secondaryGridColumns}
                 rows={rowsObj.secondaryGridRows}/>
         </Box>
     )
 }




function PrimaryGrid(props){


    const columnsObj = useContext(PrimaryGridColumnsContext)
    const rowsObj = useContext(PrimaryGridRowsContext)
    const paymentsDatasetObj = useContext(PaymentsDatasetContext)
    const secondaryGridRowsObj = useContext(SecondaryGridRowsContext)


    function handlePrimaryGridSelectionModelChange(selectionModel) {
        let array = []
        for (let propertyName in selectionModel) {
            let datasetKey = selectionModel[propertyName]
            array.push(... paymentsDatasetObj.paymentsDataset[datasetKey])
        }
        secondaryGridRowsObj.setSecondaryGridRows(array)
        console.log(selectionModel)
    }

    function getPrimaryGridDetailPanelContent(props) {
        return(
            <>
                <h1>super estatic, like the matrix</h1>
            </>
        )
    }

    function onColumnVisibilityModelChange(x){
        console.log(x)
        console.log(apiRef.current.exportState())
        uploadStateChange(apiRef.current.exportState()).then(console.log("donLSKJDALKDJAKe"))
    }

    const apiRef = useGridApiRef()


    return (
        <Box sx={{height: "100vh", width: "100%" , border: "0px solid black"}}>
            <DataGridPremium
                apiRef={apiRef}

                initialState = {props.initialPrimaryGridState}

                rowReordering
                onColumnResize={x=> console.log(x)}
                onColumnVisibilityModelChange = {onColumnVisibilityModelChange}
                processRowUpdate={uploadNewCellState}
                components={{Toolbar: GridToolbar}}
                getDetailPanelContent={getPrimaryGridDetailPanelContent}
                getDetailPanelHeight={()=> "auto"}
                experimentalFeatures={{aggregation: true, newEditingApi: true}}
                checkboxSelection
                onSelectionModelChange={handlePrimaryGridSelectionModelChange}
                columns={columnsObj.primaryGridColumns}
                rows={rowsObj.primaryGridRows}
            />
        </Box>
    )
}


