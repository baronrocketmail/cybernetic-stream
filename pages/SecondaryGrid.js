import {DataGridPremium, GridToolbar} from "@mui/x-data-grid-premium";
import {Box} from "@mui/material";

export default function SecondaryGrid(props){

    return(
        <Box sx={{height: "100vh", width: "100%"}}>
            <DataGridPremium
                components={{Toolbar: GridToolbar}}
                rowReordering
                experimentalFeatures={{aggregation: true}}
                checkboxSelection
                columns={props.columns}
                rows={props.rows}/>
        </Box>
    )
}