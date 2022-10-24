import {DataGridPremium, GridToolbar} from "@mui/x-data-grid-premium";
import {fetchAllUnits} from "./api/DataFetching";
import {useState} from "react";
import {Box} from "@mui/material";
import {objectToRows,objectToColumns,getPaymentsDataset, objectToColumnsSecondary } from "./api/dataTransformations"


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
            <Box sx={{height: "100vh", width: "100%"}}>
                <DataGridPremium
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
        </>
    )
}