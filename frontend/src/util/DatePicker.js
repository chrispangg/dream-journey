import "date-fns";
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns/";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

const MaterialUIPicker = (props) => {
      return(
	<MuiPickersUtilsProvider utils={DateFnsUtils}>
		<Grid container justify="space-around">
			<KeyboardDatePicker
				disableToolbar
				variant="inline"
				format="MM/dd/yyyy"
				margin="normal"
				id="date-picker-inline"
				label={props.datelabel}
				value={props.value}
				onChange={props.changed}
				autoOk={true}
				disablePast={true}
				KeyboardButtonProps={{"aria-label": "change date"}}
			/>
		</Grid>
	</MuiPickersUtilsProvider>
)};

export default MaterialUIPicker;