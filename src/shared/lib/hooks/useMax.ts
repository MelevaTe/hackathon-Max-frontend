const max = window.WebApp;

interface UseMaxReturn {
	onClose: () => void;
	max: WebApp;
	user: WebAppUser | undefined;
}

export const useMax = (): UseMaxReturn => {
	const onClose = () => {
		max.close();
	};

	return {
		onClose,
		max,
		user: max.initDataUnsafe?.user,
	};
};
