import { classNames } from "@/shared/lib/classNames/classNames.ts";

function App() {
	const max = window.WebApp;

	return (
		<div className={classNames("app", {}, [])}>
			<div className="content-page">
				<h1>Привет:</h1>
				<p>{max.initDataUnsafe?.user?.first_name}</p>
				<p>{max.initDataUnsafe?.user?.last_name}</p>
				<p>{max.initDataUnsafe?.user?.username}</p>
				<img
					src={max.initDataUnsafe?.user?.photo_url}
					alt="user avatar"
				/>
			</div>
		</div>
	);
}

export default App;
