const arraySubtraction = (a, b) => {
	return a.filter(c => !b.includes(c));
};

const last = (arr) => arr[arr.length-1];

const shuffle = (arr) => {
	// Source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
	for (var i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

const isSorted = (arr, func) => {
	if (arr.reduce((acc, cur) => {
		if (acc === false) return false;
		if (func(acc, cur) <= 0) return cur;
		return false;
	}, arr[0]) !== false) {
		return true;
	}
	return false;
};

const uniqueFilter = (element, index, array) => {
	return array.indexOf(element) === index;
};

export {arraySubtraction, isSorted, last, shuffle, uniqueFilter};
