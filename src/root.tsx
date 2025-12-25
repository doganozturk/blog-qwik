import { component$, useStyles$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import {
  APPLE_STATUS_BAR_META_ID,
  DEFAULT_THEME_META_KEY,
  THEME_COLOR_META_ID,
  getThemeMeta,
  themeHack,
} from "~/util";

import reset from "~/styles/reset.css?inline";
import variables from "~/styles/variables.css?inline";
import utilities from "~/styles/utilities.css?inline";
import globalStyles from "./global.css?inline";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  useStyles$(reset);
  useStyles$(variables);
  useStyles$(utilities);
  useStyles$(globalStyles);

  const defaultMeta = getThemeMeta(DEFAULT_THEME_META_KEY);

  return (
    <QwikCityProvider>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />

        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta
          id={THEME_COLOR_META_ID}
          name="theme-color"
          content={defaultMeta.themeColor}
        />
        <meta
          id={APPLE_STATUS_BAR_META_ID}
          name="apple-mobile-web-app-status-bar-style"
          content={defaultMeta.appleStatusBarStyle}
        />

        <script
          dangerouslySetInnerHTML={`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('phc_QL9oHiAomjBZDyECGA6zZn7FFWkerslXslGCGkja8Nb',{api_host:'https://us.i.posthog.com', person_profiles: 'always'})`}
        />

        <RouterHead />
      </head>
      <body lang="tr">
        <script dangerouslySetInnerHTML={themeHack} />
        <RouterOutlet />
        {/* TODO: Remove ServiceWorkerRegister after Feb 2025 - kept temporarily to
            unregister old service workers for returning users. See Qwik 1.14 migration. */}
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
