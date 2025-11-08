import {
	Container,
	Flex,
	Panel,
	Avatar,
	Button,
	Typography,
} from "@maxhub/max-ui";
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
