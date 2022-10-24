import {DataGridPremium, GridToolbar, useGridApiRef} from "@mui/x-data-grid-premium";
import {fetchAllUnits, uploadStateChange} from "./api/DataFetching";
import React, {createContext, useContext, useState} from "react";
import {Box, ThemeProvider, createTheme, colors} from "@mui/material";
import {objectToRows,objectToColumns,getPaymentsDataset, objectToColumnsSecondary} from "./api/dataTransformations"
import PrimaryGrid from "./PrimaryGrid";
import SecondaryGrid from "./SecondaryGrid";
import {PrimaryGridRowsContext, PrimaryGridColumnsContext} from "./contexts/gridContexts";

export async function getStaticProps(){
    let data = await fetchAllUnits()
    return{
        props: {data},
        revalidate: 1
    }
}


async function handleStateChange(gridState ) {
    console.log("UPDATEEE")
    // uploadStateChange(JSON.stringify(gridState.columns))
}

const theme = createTheme({
    palette: {
        primary:{
            main: colors.orange[900],
        }
    }
})

export default function Home(props) {
    const apiRef = useGridApiRef();
    const [data, setData] = useState(props.data)
    const [primaryGridRows, setPrimaryGridRows] = useState(objectToRows(data))
    const [primaryGridColumns, setPrimaryGridColumns] = useState(objectToColumns(data))
    const [secondaryGridRows, setSecondaryGridRows] = useState(getPaymentsDataset(data))
    const [secondaryGridRowsActive, setSecondaryGridRowsActive] = useState([])
    const [secondaryGridColumns, setSecondaryGridColumns] = useState(objectToColumnsSecondary(data))

    return (
        <>
            <ThemeProvider theme={theme}>
            <PrimaryGridColumnsContext.Provider value={{primaryGridColumns, setPrimaryGridColumns}}>
            <PrimaryGridRowsContext.Provider value={{primaryGridRows, setPrimaryGridRows}}>
                <PrimaryGrid/>
                {/*<SecondaryGrid/>*/}
            </PrimaryGridRowsContext.Provider>
            </PrimaryGridColumnsContext.Provider>
            </ThemeProvider>
        </>
    )
}