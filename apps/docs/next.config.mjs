/**
 * The one required line of config, exercised by the docs site itself.
 *
 * The packages ship source JSX rather than a pre-built bundle, and Next does
 * not transpile node_modules by default. Without `transpilePackages` the build
 * fails on the first `<` it meets inside the package source — which is exactly
 * the error the README tells consumers to expect. Documenting that line while
 * not depending on it would be the kind of drift this system exists to prevent,
 * so the docs site consumes the packages the same way a product does.
 */
export default {
  transpilePackages: ["@al-rayhaanat/system"],

  /**
   * Every route here is prerendered — there is no server component doing work at
   * request time, no route handler, no middleware. Exporting to plain HTML makes
   * that explicit, and makes the site deployable from any static host with no
   * Next.js runtime and no platform-specific project settings.
   */
  output: "export"
};
