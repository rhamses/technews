import { defineMiddleware } from "astro:middleware";

const PATH_PREFIX = "/technews";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url;
  if (url.hostname !== "rhams.es") {
    return next();
  }

  if (url.pathname === PATH_PREFIX || url.pathname === `${PATH_PREFIX}/`) {
    return context.redirect(`https://technews.rhams.es/${url.search}`, 302);
  }

  if (url.pathname.startsWith(`${PATH_PREFIX}/`)) {
    const suffix = url.pathname.slice(PATH_PREFIX.length);
    return context.redirect(`https://technews.rhams.es${suffix}${url.search}`, 302);
  }

  return next();
});
