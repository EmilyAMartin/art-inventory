import React, { useRef, useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : JSON.parse(initialValue);
		} catch (error) {
			console.error(error);
			return JSON.parse(initialValue);
		}
	});

	const setValue = (value) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error(error);
		}
	};

	return [storedValue, setValue];
};

const Fav = ({ id }) => {
	const [storageItem, setStorageItem] = useLocalStorage(
		'DFX-favourites',
		JSON.stringify([])
	);
	const storagedArray = useRef(JSON.parse(storageItem));
	const isFavourited = storagedArray.current.includes(id);

	const handleToggleFavourite = () => {
		if (!isFavourited) {
			storagedArray.current.push(id);
			setStorageItem(JSON.stringify(storagedArray.current));
		} else {
			const indexFavouritedId = storagedArray.current.indexOf(id);
			storagedArray.current.splice(indexFavouritedId, 1);
			setStorageItem(JSON.stringify(storagedArray.current));
		}
	};

	return (
		<button onClick={handleToggleFavourite}>
			{isFavourited ? (
				<span>❤️</span> // Replace with your full heart icon
			) : (
				<span>🤍</span> // Replace with your empty heart icon
			)}
		</button>
	);
};

export default Fav;
