import { isServer } from "@builder.io/qwik/build";

export const ColorScheme = {
	Dark: "dark",
	Light: "light",
	NoPreference: "no-preference",
} as const;

export type ColorSchemeType = (typeof ColorScheme)[keyof typeof ColorScheme];

const LOCAL_STORAGE_KEY = "user-color-scheme";

export const getColorScheme = (): ColorSchemeType => {
	// Si le code est exécuté côté serveur, retourner Light par défaut
	if (isServer) {
		return ColorScheme.Light;
	}

	// Vérifier si window et localStorage sont disponibles
	if (
		typeof window === "undefined" ||
		!window.localStorage ||
		!window.matchMedia
	) {
		return ColorScheme.NoPreference;
	}

	// Vérifier si une préférence est déjà sauvegardée dans le localStorage
	const savedPreference = window.localStorage.getItem(
		LOCAL_STORAGE_KEY,
	) as ColorSchemeType | null;
	if (savedPreference) {
		return savedPreference;
	}

	// Vérifier la préférence de schéma de couleurs
	const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
	const lightModeQuery = window.matchMedia("(prefers-color-scheme: light)");

	let preference: ColorSchemeType;

	switch (true) {
		case darkModeQuery.matches:
			preference = ColorScheme.Dark;
			break;
		case lightModeQuery.matches:
			preference = ColorScheme.Light;
			break;
		default:
			preference = ColorScheme.NoPreference;
	}

	// Sauvegarder la préférence dans le localStorage
	window.localStorage.setItem(LOCAL_STORAGE_KEY, preference);

	return preference;
};
