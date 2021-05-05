import { configure, shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import "@testing-library/jest-dom/extend-expect";
import AddLocationCard from "../AddLocationCard/AddLocationCard";
import { Button, Typography } from "@material-ui/core/";
import MUISearch from "../MUISearch/MUISearch.component";
import TableCell from "@material-ui/core/TableCell";
import TripSummary from "../TripSummary/TripSummary.component";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import StaySummary from "../StaySummary/StaySummary.component";
import ActivitiesSummary from "../ActivitiesSummary/ActivitiesSummary.component";


configure({ adapter: new Adapter() });

//required for testing components with mapbox
jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
	Map: () => ({}),
}));

describe("Test Mapbox API", () => {
	//Please enter your Mapbox API in .env
	const token = process.env.REACT_APP_MAPBOX;
	const locationURI = encodeURIComponent("Auckland, Auckland, New Zealand");
	const types = "region,place";
	it("API testing", async function () {
		const response = await axios.get(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${locationURI}.json?types=${types}&access_token=${token}&proximity=171.779900195937,-41.8388752215127`
		);
		const responseJSON = response.data.features[0];

		expect(responseJSON.geometry.coordinates[0]).toEqual(174.78333);
		expect(responseJSON.geometry.coordinates[1]).toEqual(-36.85);
		expect(responseJSON.id).toEqual("place.8719945336241010");
	});
});

describe("Test AddLocationCard Component", () => {
	it('AddLocationCard shows "Add a Trip"', () => {
		const wrapper = shallow(<AddLocationCard />).dive();
		expect(wrapper.find(Typography).text()).toEqual("Add a Trip");
	});

	it("AddLocationCard shows a button to add trip", () => {
		const wrapper = shallow(<AddLocationCard />).dive();
		expect(wrapper.find(Button).text()).toEqual("Add Trip");
	});

	it("AddLocationCard shows a 'SearchField'", () => {
		const wrapper = shallow(<AddLocationCard />).dive();
		expect(wrapper.find(MUISearch)).toBeTruthy();
	});
});

describe("Test TripListCard Component", () => {
	it("TripSummary tableCell display 'Start Date'", () => {
		const wrapper = shallow(<TripSummary />);
		expect(wrapper.find(TableCell).at(1).text()).toEqual("Start Date");
	});
	it("TripSummary tableCell display 'End Date'", () => {
		const wrapper = shallow(<TripSummary />);
		expect(wrapper.find(TableCell).at(2).text()).toEqual("End Date");
	});
	it("TripSummary tableCell display 'Edit/ Delete'", () => {
		const wrapper = shallow(<TripSummary />);
		expect(wrapper.find(TableCell).at(3).text()).toEqual("Edit/ Delete");
	});
	it("TripSummary tableCell display 'View'", () => {
		const wrapper = shallow(<TripSummary />);
		expect(wrapper.find(TableCell).at(4).text()).toEqual("View");
	});
});

describe("Test Navbar Component", () => {
	it("Navbar display 'DreamJourney'", () => {
		const wrapper = shallow(<Navbar />);
		expect(wrapper.find(Typography).text()).toEqual("DreamJourney");
	});
});

describe("Test StaySummary Component", () => {
	it("StaySummary display 'Hotel'", () => {
		const wrapper = shallow(<StaySummary />);
		expect(wrapper.find(TableCell).at(0).text()).toEqual("Hotel");
	});
	it("StaySummary display 'Check-in Date'", () => {
		const wrapper = shallow(<StaySummary />);
		expect(wrapper.find(TableCell).at(1).text()).toEqual("Check-in Date");
	});
	it("StaySummary display 'Check-out Date'", () => {
		const wrapper = shallow(<StaySummary />);
		expect(wrapper.find(TableCell).at(2).text()).toEqual("Check-out Date");
	});
	it("StaySummary display 'Address'", () => {
		const wrapper = shallow(<StaySummary />);
		expect(wrapper.find(TableCell).at(3).text()).toEqual("Address");
	});
	it("StaySummary display a 'UPDATE' button", () => {
		const wrapper = shallow(<StaySummary />);
		expect(wrapper.find(Button).at(0).text()).toEqual("UPDATE");
	});
	it("StaySummary display a 'CANCEL' button", () => {
		const wrapper = shallow(<StaySummary />);
		expect(wrapper.find(Button).at(1).text()).toEqual("CANCEL");
	});
});

describe("Test ActivitySummary Component", () => {
	it("ActivitiesSummary display 'Activity'", () => {
		const wrapper = shallow(<ActivitiesSummary/>);
		expect(wrapper.find(TableCell).at(0).text()).toEqual("Activity");
	});
	it("ActivitiesSummary display 'Start Date'", () => {
		const wrapper = shallow(<ActivitiesSummary />);
		expect(wrapper.find(TableCell).at(1).text()).toEqual("Start Date");
	});
	it("ActivitiesSummary display 'End Date'", () => {
		const wrapper = shallow(<ActivitiesSummary />);
		expect(wrapper.find(TableCell).at(2).text()).toEqual("End Date");
	});
	it("ActivitiesSummary display 'Start Time'", () => {
		const wrapper = shallow(<ActivitiesSummary />);
		expect(wrapper.find(TableCell).at(3).text()).toEqual("Start Time");
	});
	it("ActivitiesSummary display 'Finish Time'", () => {
		const wrapper = shallow(<ActivitiesSummary />);
		expect(wrapper.find(TableCell).at(4).text()).toEqual("Finish Time");
	});
	it("ActivitiesSummary display 'Address'", () => {
		const wrapper = shallow(<ActivitiesSummary />);
		expect(wrapper.find(TableCell).at(5).text()).toEqual("Address");
	});
	it("ActivitiesSummary display a 'UPDATE' button", () => {
		const wrapper = shallow(<ActivitiesSummary />);
		expect(wrapper.find(Button).at(0).text()).toEqual("UPDATE");
	});
	it("ActivitiesSummary display a 'CANCEL' button", () => {
		const wrapper = shallow(<ActivitiesSummary />);
		expect(wrapper.find(Button).at(1).text()).toEqual("CANCEL");
	});

});




