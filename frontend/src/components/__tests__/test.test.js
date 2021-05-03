import { configure, shallow, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { render, fireEvent, cleanup, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import React, { useContext, useState } from "react";
import { AppContext } from "../../AppContextProvider";
import TripSummary from "../TripSummary/TripSummary.component";
import TextField from "@material-ui/core/TextField";
import { createMount, createShallow } from "@material-ui/core/test-utils";

configure({ adapter: new Adapter() });

// const wrapper = mount(<TripSummary />);
// const textFieldMUI = wrapper.find(TextField);

// describe('Initial test, validate fields', ()=>{
//       test('TextField component should exists.', () => {
//             expect(textFieldMUI).toBeDefined();
//             console.log();
//           });

// });

describe("<TripSummary />", () => {
	let shallow;

	beforeAll(() => {
		shallow = createShallow();
	});

	it("should render searchField", () => {
		const wrapper = shallow(<TripSummary />);
		const textfield = wrapper.find(TextField).at(0);
		expect(textfield).toHaveLength(1);
	});
      it("should render dates", () => {
		const wrapper = shallow(<TripSummary />);
		const textfield = wrapper.find(TextField).at(0);
		expect(textfield).toHaveLength(1);
	});
});
