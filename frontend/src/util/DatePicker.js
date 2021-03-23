import "date-fns";
import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns/";
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from "@material-ui/pickers";

const MaterialUIPicker = (props) => {
      const [selectedDate, setSelectedDate] = useState(new Date('2020-03-25T00:00:00'));
      const handleDateChange = (date) => {
            setSelectedDate(date);
          };

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
				value={selectedDate}
				onChange={handleDateChange}
				KeyboardButtonProps={{
					"aria-label": "change date",
				}}
			/>
		</Grid>
	</MuiPickersUtilsProvider>
)};

export default MaterialUIPicker;
