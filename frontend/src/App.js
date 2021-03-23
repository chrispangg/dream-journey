import React from "react";
import Navbar from "./components/Navbar/Navbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Homepage from "./pages/Homepage";

function App() {
	return (
		<>
			<Navbar />
			<CssBaseline />
			<Homepage />
		</>
	);
}
export default App;
