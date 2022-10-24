import {Box} from "@mui/material";
import {DataGridPremium, GridToolbar} from "@mui/x-data-grid-premium";
import {useContext} from "react";
import {PrimaryGridColumnsContext, PrimaryGridRowsContext} from "./contexts/gridContexts";


export default function PrimaryGrid(props){

    // function handlePrimaryGridSelectionModelChange(selectionModel) {
    //     let array = []
    //     for (let elem in selectionModel) {
    //         array.push(...secondaryGridRows[selectionModel[elem]])
    //     }
    //     props.setSecondaryGridRowsActive(array)
    // }
    const columns = useContext(PrimaryGridColumnsContext)
    const rows = useContext(PrimaryGridRowsContext)

    return (
        // <h1>sd</h1>
    <Box sx={{height: "100vh", width: "100%" , border: "0px solid black"}}>
        <DataGridPremium
            rowReordering
            components={{Toolbar: GridToolbar}}
            getDetailPanelContent={getPrimaryGridDetailPanelContent}
            getDetailPanelHeight={()=> "auto"}
            experimentalFeatures={{aggregation: true, newEditingApi: true}}
            checkboxSelection
            onSelectionModelChange={(selectionModel) => handlePrimaryGridSelectionModelChange(selectionModel)}
            columns={columns.primaryGridColumns}
            rows={rows.primaryGridRows}
        />
    </Box>
    )
}

function getPrimaryGridDetailPanelContent(props) {
    return(
        <>
            <h1>super estatic, like the matrix</h1>
        </>
    )
}


