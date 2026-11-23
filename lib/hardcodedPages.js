// Pages that now live in the codebase (app/<slug>/page.js) instead of
// Contentful. A leftover CMS entry with the same slug is skipped by the
// [slug] route and the sitemap, so the two never collide.
export const HARDCODED_PAGE_SLUGS = ['faqs']

// CMS pages that redirect elsewhere (see redirects() in next.config.mjs).
// They are left out of the static build and the sitemap even while the
// Contentful entry still exists.
export const REDIRECTED_PAGE_SLUGS = ['terms-and-conditions']

// CMS pages served at a different URL than their Contentful title gives:
// { slug from the title: public slug }. The old URL redirects to the new one
// (next.config.mjs). Once the entry's title is renamed in Contentful to match,
// its slug already equals the public one and the alias simply stops applying.
export const PAGE_SLUG_ALIASES = { 'help-contact': 'customer-service' }

export const publicPageSlug = slug => PAGE_SLUG_ALIASES[slug] || slug
