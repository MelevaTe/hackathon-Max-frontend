import { Avatar } from "@maxhub/max-ui";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { RoutePath } from "@/shared/const/router.ts";
import cls from "./ClickableAvatar.module.scss";

interface ClickableAvatarProps {
	userId?: number;
	photoUrl?: string;
	fallback?: string;
	size?: number;
	className?: string;
}

export const ClickableAvatar: React.FC<ClickableAvatarProps> = memo(
	({ userId, photoUrl, fallback = "ME", size = 50, className }) => {
		const to = `${RoutePath.profile}${userId}`;

		return (
			<Link to={to}>
				<Avatar.Container
					size={size}
					form={"circle"}
					className={cls.avatar}
				>
					<Avatar.Image
						fallback={fallback}
						fallbackGradient={"blue"}
						src={photoUrl}
					/>
				</Avatar.Container>
			</Link>
		);
	}
);
