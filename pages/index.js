import {DataGridPremium, GridToolbar, useGridApiRef, useGridApiContext} from "@mui/x-data-grid-premium";
import {fetchAllUnits, uploadNewCellState, uploadStateChange, getPrimaryGridState} from "./api/DataFetching.mjs";
import React, {createContext, useContext, useState} from "react";
import {Box, ThemeProvider, createTheme, colors} from "@mui/material";
import {objectToRows,objectToColumns,getPaymentsDataset, objectToColumnsSecondary, getPrimaryColumnVisibilityModelState} from "./api/dataTransformations"
import { GridApi } from '@mui/x-data-grid-premium';
import { initializeApp } from "firebase/app";
import {getFirestore, query, where, collection, getDocs , addDoc, serverTimestamp, doc, updateDoc, setDoc, getDoc} from "firebase/firestore";

export async function getStaticProps(){
    let initialPrimaryGridState = await getPrimaryGridState()
    let initialColumnVisibilityModel = await getColumnVisibility()
    let fullInitialState = initialPrimaryGridState
    fullInitialState.columns.columnVisibilityModel = initialColumnVisibilityModel


    let data = await fetchAllUnits()
    return{
        props: {data, fullInitialState},
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
                    <PrimaryGrid initialState = {props.fullInitialState}/>
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

    console.log(props.initialState)


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
    }

    function getPrimaryGridDetailPanelContent(props) {
        return(
            <>
                <h1>super estatic, like the matrix</h1>
            </>
        )
    }
    function onColumnVisibilityModelChange(x){
        console.log("INITIALSTATE")
        console.log(props.initialState)
        console.log(apiRef.current)
        console.log(x)
        uploadColumnVisibility(x).then(console.log("TITANIC"))

        uploadStateChange(apiRef.current.exportState()).then(console.log("donLSKJDALKDJAKe"))
    }

    const apiRef = useGridApiRef()

    return (
        <Box sx={{height: "100vh", width: "100%" , border: "0px solid black"}}>
            <DataGridPremium
                apiRef={apiRef}
                initialState = {props.initialState}
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

/// INITIALIZE fire FIREBASE and FIRESTORE
const firebaseConfig = {
    apiKey: "AIzaSyDPGmgTxlAsVkakZrGbs8NTF2r0RcWu_ig",
    authDomain: "luminous-lambda-364207.firebaseapp.com",
    projectId: "luminous-lambda-364207",
    storageBucket: "luminous-lambda-364207.appspot.com",
    messagingSenderId: "518969290682",
    appId: "1:518969290682:web:d7be744cb378ec83d4f783"
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore()

export async function uploadColumnVisibility(gridState){    return new Promise(function(resolve,reject) {
    setDoc(doc(firestore, "websites/cybernetic stream/states", "ColumnVisibilityModel"),  { createdAt: serverTimestamp(), gridState: JSON.stringify(gridState)}).then(resolve("state updated"))
})
}

export async function getColumnVisibility(gridState){
    return new Promise(function(resolve, reject){
        getDoc(doc(firestore, "websites/cybernetic stream/states", "ColumnVisibilityModel")).then(x => resolve((JSON.parse(x.data().gridState))))
    })
}