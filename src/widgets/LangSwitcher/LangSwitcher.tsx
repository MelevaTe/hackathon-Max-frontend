import { IconButton } from "@maxhub/max-ui";
import { Globe } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

interface LangSwitcherProps {
	className?: string;
	short?: boolean;
}

const LangSwitcher = memo(({ className, short }: LangSwitcherProps) => {
	const { t, i18n } = useTranslation();

	const toggle = async () => {
		i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
	};

	const currentLang = i18n.language.startsWith("ru") ? "RU" : "EN";

	return (
		<IconButton
			appearance="themed"
			asChild
			mode="secondary"
			size="medium"
			onClick={toggle}
		>
			<Globe />
		</IconButton>
	);
});

export default LangSwitcher;
