import {
	Container,
	Flex,
	Panel,
	Avatar,
	Button,
	Typography,
	CellList,
	CellHeader,
	CellSimple,
	IconButton,
} from "@maxhub/max-ui";
import { CircleArrowLeft, Sun } from "lucide-react";
import { CloudHail } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";
import { useMax } from "@/shared/lib/hooks/useMax.ts";
import cls from "./ProfilePage.module.scss";

const ProfilePage = () => {
	const { user, max, onClose } = useMax();

	console.log(max?.initData);
	return (
		<Panel
			mode="secondary"
			className={cls.page}
		>
			<div className={cls.iconButtonWrapper}>
				<IconButton
					appearance="themed"
					aria-label="Название кнопки"
					asChild
					mode="secondary"
					size="medium"
				>
					<Link to="/">
						<CircleArrowLeft />
					</Link>
				</IconButton>
			</div>
			<Flex
				direction="column"
				gap={24}
				style={{ height: "100%" }}
			>
				<Container className={cls.header}>
					<Flex
						direction="column"
						align="center"
						gap={16}
					>
						<Avatar.Container size={96}>
							<Avatar.Image
								fallback="ME"
								fallbackGradient={"blue"}
								src={user?.photo_url}
							/>
						</Avatar.Container>

						<Flex
							direction="column"
							align="center"
						>
							<Typography.Headline variant="large-strong">{`${user?.first_name}, ${user?.last_name}`}</Typography.Headline>
						</Flex>
					</Flex>
				</Container>

				<Flex
					direction="column"
					gap={16}
					className={cls.content}
				>
					<CellList
						mode="island"
						header={<CellHeader>Активные записи</CellHeader>}
					>
						<CellSimple
							after={
								<Button
									appearance="themed"
									asChild
									mode="primary"
									size="medium"
								>
									<Link to="/">Маршурт</Link>
								</Button>
							}
							before={<Sun color="#007bff" />}
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
							className={cls.cell}
						/>
						<CellSimple
							after={
								<Button
									appearance="themed"
									asChild
									mode="primary"
									size="medium"
								>
									<Link to="/">Маршурт</Link>
								</Button>
							}
							onClick={() => {}}
							before={<CloudHail color="#007bff" />}
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
						/>

						<CellSimple
							after={
								<Button
									appearance="themed"
									asChild
									mode="primary"
									size="medium"
								>
									<Link to="/">Маршурт</Link>
								</Button>
							}
							onClick={() => {}}
							before={<Sun color="#007bff" />}
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
							className={cls.cell}
						/>
						<CellSimple
							after={
								<Button
									appearance="themed"
									asChild
									mode="primary"
									size="medium"
								>
									<Link to="/">Маршурт</Link>
								</Button>
							}
							before={<CloudHail color="#007bff" />}
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
						/>
						<CellSimple
							after={
								<Button
									appearance="themed"
									asChild
									mode="primary"
									size="medium"
								>
									<Link to="/">Маршурт</Link>
								</Button>
							}
							before={<Sun color="#007bff" />}
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
						/>
					</CellList>
					<CellList
						filled
						mode="island"
						header={<CellHeader>История записей</CellHeader>}
					>
						<CellSimple
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
						/>
						<CellSimple
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
						/>
						<CellSimple
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
						/>
						<CellSimple
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
						/>
						<CellSimple
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
						/>
						<CellSimple
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
						/>
					</CellList>
				</Flex>

				<Container className={cls.footerButton}>
					<Flex gap={8}>
						<Button
							onClick={onClose}
							size="large"
							mode="secondary"
							appearance="neutral"
							stretched
						>
							Выйти из приложения
						</Button>
					</Flex>
				</Container>
			</Flex>
		</Panel>
	);
};

export default memo(ProfilePage);
