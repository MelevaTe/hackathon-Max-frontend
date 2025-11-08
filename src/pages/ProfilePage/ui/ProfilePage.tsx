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
} from "@maxhub/max-ui";
import { Sun } from "lucide-react";
import { CloudHail } from "lucide-react";
import { memo } from "react";
import { useMax } from "@/shared/lib/hooks/useMax.ts";

const ProfilePage = () => {
	const { user } = useMax();

	return (
		<Panel mode="secondary">
			<Flex
				direction="column"
				gap={24}
			>
				<Container>
					<Flex
						direction="column"
						align="center"
						gap={16}
					>
						<Avatar.Container
							size={96}
							rightBottomCorner={<Avatar.OnlineDot />}
						>
							<Avatar.Image
								fallback="ME"
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
				>
					<CellList
						mode="island"
						header={<CellHeader>Активные записи</CellHeader>}
					>
						<CellSimple
							after={
								<Button
									key="icon"
									mode="secondary"
									size="small"
								>
									Построить маршрут
								</Button>
							}
							before={<Sun />}
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
						/>
						<CellSimple
							after={
								<Button
									key="icon"
									mode="secondary"
									size="small"
								>
									Построить маршрут
								</Button>
							}
							before={<CloudHail />}
							height="normal"
							overline=""
							subtitle="2025-11-12 • 14:00"
							title="Теннисный корт Спортивный"
						/>
						<CellSimple
							after={
								<Button
									key="icon"
									mode="secondary"
									size="small"
								>
									Построить маршрут
								</Button>
							}
							before={<Sun />}
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
					</CellList>
				</Flex>

				<Container>
					<Flex gap={8}>
						<Button
							size="large"
							mode="secondary"
							appearance="neutral"
							stretched
						>
							Выйти
						</Button>
					</Flex>
				</Container>
			</Flex>
		</Panel>
	);
};

export default memo(ProfilePage);
