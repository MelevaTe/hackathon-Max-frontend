import { classNames } from "@/shared/lib/classNames/classNames.ts";

function App() {
	const max = window.WebApp;

	const user = max.initDataUnsafe?.user;
	if (!user) {
		return (
			<div className={classNames("app", {}, [])}>
				<div className="content-page">
					<p>Не удалось получить данные пользователя.</p>
				</div>
			</div>
		);
	}

	return (
		<div className={classNames("app", {}, [])}>
			<div className="content-page">
				<h1>Привет:</h1>
				<p>{user.first_name || "—"}</p>
				<p>{user.last_name || "—"}</p>
				<p>{user.username || "—"}</p>
				{user.photo_url && (
					<img
						src={user.photo_url}
						alt="user avatar"
					/>
				)}
			</div>
		</div>
	);
}

export default App;
