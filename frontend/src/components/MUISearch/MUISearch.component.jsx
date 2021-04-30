import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import throttle from "lodash/throttle";
import axios from "axios";
import mapboxgl from "mapbox-gl";

const useStyles = makeStyles((theme) => ({
	icon: {
		color: theme.palette.text.secondary,
		marginRight: theme.spacing(2),
	},
}));

export default function GoogleMaps(props) {
	mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;
	const classes = useStyles();
	const [value, setValue] = React.useState(null);
	const [inputValue, setInputValue] = React.useState("");
	const [options, setOptions] = React.useState([]);

	// console.log(value);
	// console.log(options);

	const fetch = React.useMemo(
		() =>
			throttle(async (input, callback) => {
				const locationURI = encodeURIComponent(input.input);
				const response = await axios.get(
					`https://api.mapbox.com/geocoding/v5/mapbox.places/${locationURI}.json?types=${props.types}&access_token=${mapboxgl.accessToken}&proximity=171.779900195937,-41.8388752215127`
				);
				// console.log(response);
				callback(response.data.features);
			}, 200),
		[]
	);

  const handleChange = (newValue) =>{
    // console.log(newValue);
    props.changed(newValue);
  }

	React.useEffect(() => {
		let active = true;

		if (inputValue === "") {
			setOptions(value ? [value] : []);
			return undefined;
		}

		fetch({ input: inputValue }, (results) => {
			// console.log(results);
			if (active) {
				let newOptions = [];
				if (value) {
					newOptions = [value];
				}
				if (results) {
					newOptions = [...newOptions, ...results];
				}
				setOptions(newOptions);
			}
		});

		return () => {
			active = false;
		};
	}, [value, inputValue, fetch]);

	return (
		<Autocomplete
			style={{ width: 300 }}
			getOptionLabel={(option) => option.text}
			filterOptions={(x) => x}
			options={options}
			autoComplete
			includeInputInList
			filterSelectedOptions
			value={value}
			onChange={(event, newValue) => {
				setOptions(newValue ? [newValue, ...options] : options);
				setValue(newValue);
				if (newValue !== null) {
          handleChange(newValue);
				}
			}}
			onInputChange={(event, newInputValue) => {
				setInputValue(newInputValue);
			}}
			renderInput={(params) => (
				<TextField
					{...params}
					margin="dense"
					size="medium"
					label="Add a location"
					variant="outlined"
					fullWidth
				/>
			)}
			renderOption={(option) => {
				return (
					<Grid container alignItems="center">
						<Grid item>
							<LocationOnIcon className={classes.icon} />
						</Grid>
						<Grid item xs>
							<span key={option.id} style={{ fontWeight: 700 }}>
								{option.text}
							</span>
							<Typography variant="body2" color="textSecondary">
								{option.place_name}
							</Typography>
						</Grid>
					</Grid>
				);
			}}
		/>
	);
}
