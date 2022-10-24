import {DataGridPremium, GridToolbar} from "@mui/x-data-grid-premium";
import {fetchAllUnits} from "./api/DataFetching";
import {useState} from "react";
import {Box, ThemeProvider, createTheme, colors} from "@mui/material";
import {objectToRows,objectToColumns,getPaymentsDataset, objectToColumnsSecondary } from "./api/dataTransformations"

const theme = createTheme({
    palette: {

        primary:{
            main: colors.orange[900],

        }
    }
})
const theme2 = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
        text: {
            primary: 'rgba(255,255,255,0.87)',
            secondary: 'rgba(255,255,255,0.54)',
            disabled: 'rgba(140,140,140,0.38)',
        },
        background: {
            default: '#000000',
            paper: '#000000',
        },
    },
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



export default function Home(props) {
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
            <ThemeProvider theme={theme2}>

            <Box sx={{height: "100vh", width: "100%" , border: "0px solid black"}}>
                <DataGridPremium

                    onStateChange={(x)=>console.log(x)}

                    rowReordering
                    components={{Toolbar: GridToolbar}}
                    getDetailPanelHeight={() => "auto"}
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