import { classNames } from "@/shared/lib/classNames/classNames.ts";

function App() {
	return (
		<div className={classNames("app", {}, [])}>
			<div className="content-page">Hello world</div>
		</div>
	);
}

export default App;
