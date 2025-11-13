import {
	Container,
	Flex,
	Panel,
	Avatar,
	Button,
	Typography,
	IconButton,
} from "@maxhub/max-ui";
import { CircleArrowLeft } from "lucide-react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { InfiniteBookingList } from "@/features/infiniteBookingList/ui/InfiniteBookitList.tsx";
import { useMax } from "@/shared/lib/hooks/useMax.ts";
import cls from "./ProfilePage.module.scss";

const ProfilePage = () => {
	const { user, onClose } = useMax();
	const navigate = useNavigate();

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
					onClick={() => navigate("/")}
				>
					<CircleArrowLeft />
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
							<Typography.Headline variant="large-strong">
								{user?.first_name && user?.last_name
									? `${user.first_name}, ${user.last_name}`
									: user?.first_name || user?.last_name || ""}
							</Typography.Headline>
						</Flex>
					</Flex>
				</Container>

				<Flex
					direction="column"
					gap={16}
					className={cls.content}
				>
					<InfiniteBookingList type="active" />
					<InfiniteBookingList type="history" />
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
