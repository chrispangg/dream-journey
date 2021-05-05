import axios from "axios";

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
