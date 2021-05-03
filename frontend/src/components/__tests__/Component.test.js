import { configure, shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import "@testing-library/jest-dom/extend-expect";
import AddLocationCard from "../AddLocationCard/AddLocationCard";
import { Button, Typography } from "@material-ui/core/";
import MUISearch from "../MUISearch/MUISearch.component";
import TableCell from "@material-ui/core/TableCell";
import TripSummary from "../TripSummary/TripSummary.component";

configure({ adapter: new Adapter() });

//required for testing components with mapbox
jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
	Map: () => ({}),
}));

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
	it("TripSummary tableCell display 'Start Date'",()=>{
		const wrapper = shallow(<TripSummary/>);
		expect(wrapper.find(TableCell).at(1).text()).toEqual("Start Date");
	});
	it("TripSummary tableCell display 'End Date'",()=>{
		const wrapper = shallow(<TripSummary/>);
		expect(wrapper.find(TableCell).at(2).text()).toEqual("End Date");
	});
	it("TripSummary tableCell display 'Edit/ Delete'",()=>{
		const wrapper = shallow(<TripSummary/>);
		expect(wrapper.find(TableCell).at(3).text()).toEqual("Edit/ Delete");
	});
	it("TripSummary tableCell display 'View'",()=>{
		const wrapper = shallow(<TripSummary/>);
		expect(wrapper.find(TableCell).at(4).text()).toEqual("View");
	});
});
