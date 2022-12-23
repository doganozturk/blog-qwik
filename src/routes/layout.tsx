import {
  component$,
  createContext,
  Slot,
  useClientEffect$,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { Footer } from "~/components/footer/footer";

export interface Theme {
  theme: string;
}

export const ThemeContext = createContext<Theme>("theme-context");

export default component$(() => {
  const state = useStore<Theme>({
    theme: "",
  });
  useContextProvider(ThemeContext, state);

  useClientEffect$(({ track }) => {
    const theme = track(() => state.theme);

    if (theme) {
      localStorage.setItem("theme", theme);
    }
  });

  useClientEffect$(({ track }) => {
    const theme = track(() => localStorage.getItem("theme"));

    if (!state.theme && theme) {
      state.theme = localStorage.getItem("theme") || "";
    }
  });

  return (
    <div className={`theme-container ${state.theme}`}>
      <div className="container">
        <Slot name="header" />
        <Slot />
        <Footer />
      </div>
    </div>
  );
});
