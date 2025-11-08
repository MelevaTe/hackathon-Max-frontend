export const reverseGeocodeApi = async (
	coordinates: [number, number]
): Promise<string | null> => {
	const [lon, lat] = coordinates;

	if (typeof lat !== "number" || typeof lon !== "number") {
		return null;
	}

	const apiKey = import.meta.env.VITE_2GIS_API_KEY;
	if (!apiKey) {
		throw new Error("Нету api 2gis ключа");
	}

	const url = new URL("https://catalog.api.2gis.com/3.0/items/geocode");
	url.searchParams.set("lat", lat.toString());
	url.searchParams.set("lon", lon.toString());
	url.searchParams.set("key", apiKey);

	try {
		const response = await fetch(url.toString());

		if (!response.ok) {
			console.log(`2gis ошибка: ${response.status} for [${lon}, ${lat}]`);
			return null;
		}

		const data = await response.json();

		if (
			data.meta.code !== 200 ||
			data.result.total === 0 ||
			!data.result.items[0]
		) {
			return null;
		}

		const item = data.result.items[0];
		return item.full_name || "Адрес не найден";
	} catch (error) {
		console.error("2gis Reverse geocoding failed:", error);
		return null;
	}
};
