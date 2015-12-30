var beepiOpts = {};
//hatchback = 8, wagon = 9
beepiOpts.bodyTypes = ["8", "9"];
beepiOpts.maxPrice = 20000;
beepiOpts.maxMiles = 60000;

module.exports = {
	bodyTypes: beepiOpts.bodyTypes,
	colors: [],
	driveTrains: [],
	generalOptions: [],
	makeIds: [],
	maxMiles: beepiOpts.maxMiles,
	maxPrice: beepiOpts.maxPrice,
	minAverageMPG: null,
	minHorsePower: null,
	minMiles: null,
	minPrice: null,
	modelIds: [],
	numberOfDoors: [],
	sortedBy: null,
	transmissionType: null,
	trimIds: [],
	years: []
}