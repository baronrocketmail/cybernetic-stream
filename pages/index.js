import {DataGridPremium, GridToolbar, useGridApiRef} from "@mui/x-data-grid-premium";
import {fetchAllUnits, uploadStateChange} from "./api/DataFetching";
import {useState} from "react";
import {Box, ThemeProvider, createTheme, colors} from "@mui/material";
import {objectToRows,objectToColumns,getPaymentsDataset, objectToColumnsSecondary} from "./api/dataTransformations"

const theme = createTheme({
    palette: {

        primary:{
            main: colors.orange[900],

        }
    }
})

export async function getStaticProps(){
    let data = await fetchAllUnits()
    return{
        props: {data},
        revalidate: 1
    }
}


function getPrimaryGridDetailPanelContent(props) {
    return(
        <>
            <h1>super estatic, like the matrix</h1>
        </>
    )
}


async function handleStateChange(gridState ) {

    console.log("UPDATEEE")


    // uploadStateChange(JSON.stringify(gridState.columns))
}

export default function Home(props) {
    const [nextTimeUpdateOkay, setNextTimeUpdateOkay] = useState(new Date())
    const [data, setData] = useState(props.data)
    const [primaryGridRows, setPrimaryGridRows] = useState(objectToRows(data))
    const [primaryGridColumns, setPrimaryGridColumns] = useState(objectToColumns(data))
    const [secondaryGridRows, setSecondaryGridRows] = useState(getPaymentsDataset(data))
    const [secondaryGridRowsActive, setSecondaryGridRowsActive] = useState([])
    const [secondaryGridColumns, setSecondaryGridColumns] = useState(objectToColumnsSecondary(data))

    function handlePrimaryGridSelectionModelChange(selectionModel) {
        let array = []
        for (let elem in selectionModel) {
            array.push(...secondaryGridRows[selectionModel[elem]])
        }
        setSecondaryGridRowsActive(array)
    }

    return (
        <>
            <ThemeProvider theme={theme}>

            <Box sx={{height: "100vh", width: "100%" , border: "0px solid black"}}>
                <DataGridPremium
                    rowReordering
                    components={{Toolbar: GridToolbar}}
                    getDetailPanelContent={getPrimaryGridDetailPanelContent}
                    experimentalFeatures={{aggregation: true, newEditingApi: true}}
                    checkboxSelection
                    onSelectionModelChange={(selectionModel) => handlePrimaryGridSelectionModelChange(selectionModel)}
                    columns={primaryGridColumns}
                    rows={primaryGridRows}/>
            </Box>

            <Box sx={{height: "100vh", width: "100%"}}>
                <DataGridPremium
                    components={{Toolbar: GridToolbar}}
                    rowReordering
                    experimentalFeatures={{aggregation: true}}
                    checkboxSelection
                    columns={secondaryGridColumns}
                    rows={secondaryGridRowsActive}/>
            </Box>
                </ThemeProvider>

                </>
    )
}