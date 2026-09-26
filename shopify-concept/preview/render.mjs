/**
 * Local preview renderer for the Shopify theme.
 *
 * A Shopify theme normally needs a store to render. This harness runs the real
 * Liquid templates against fixture data and writes static HTML, so the theme
 * can be reviewed before any Shopify account exists.
 *
 * It emulates the Shopify-specific parts of Liquid that this theme uses:
 *   tags    — {% schema %}, {% section %}, {% form %}
 *   filters — asset_url, image_url, money, money_with_currency
 *   globals — shop.metaobjects, collections, product, page, routes, linklists
 *
 * It is NOT a Shopify emulator. It renders exactly what this theme needs and no
 * more. The theme itself is real and uploadable; this file is scaffolding.
 */

import { Liquid } from "liquidjs";
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SHOWS, RELEASES, PRODUCTS, COLLECTION, MENU, ABOUT_CONTENT } from "./data.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const THEME = join(here, "..", "theme");
const OUT = join(here, "..", "out");

const engine = new Liquid({
  root: [join(THEME, "snippets"), join(THEME, "sections"), join(THEME, "templates")],
  extname: ".liquid",
  jsTruthy: true,
});

/* ── Shopify filters ──────────────────────────────────────── */

engine.registerFilter("asset_url", (file) => `/assets/${file}`);

// Shopify rewrites image URLs for its CDN; locally the asset path is enough.
engine.registerFilter("image_url", (src) =>
  typeof src === "string" ? `/assets/${src}` : `/assets/${src?.src ?? ""}`,
);

// Shopify's money filter keeps the minor units (£25.00, not £25), and so does
// formatMoney in the Next build. Matching both keeps the two versions
// comparable down to the price column.
const gbp = (pence) => `£${(Number(pence) / 100).toFixed(2)}`;

engine.registerFilter("money", gbp);
engine.registerFilter("money_with_currency", (p) => `${gbp(p)} GBP`);

/* ── Shopify tags ─────────────────────────────────────────── */

/**
 * Swallow a block tag's body entirely, returning nothing.
 *
 * Uses liquidjs's `tag:<name>` stream event rather than matching on the generic
 * `token` event — the generic event fires before templates are emitted, so a
 * handler there silently drops the block's contents.
 */
function swallowBlock(endName) {
  return {
    parse(token, remainTokens) {
      const stream = this.liquid.parser
        .parseStream(remainTokens)
        .on(`tag:${endName}`, () => stream.stop())
        .on("end", () => {
          throw new Error(`${token.getText()} not closed`);
        });
      stream.start();
    },
    render() {
      return "";
    },
  };
}

// {% schema %} is admin metadata, never output.
engine.registerTag("schema", swallowBlock("endschema"));

// {% style %} / {% javascript %} are not used here but are cheap to tolerate.
engine.registerTag("javascript", swallowBlock("endjavascript"));

/**
 * {% form 'product', product %} … {% endform %}
 *
 * Shopify generates the form element, its action and its hidden fields. The
 * preview emits an inert equivalent — submitting it does nothing, since there
 * is no cart.
 */
engine.registerTag("form", {
  parse(token, remainTokens) {
    this.args = token.args;
    this.tpls = [];
    const stream = this.liquid.parser
      .parseStream(remainTokens)
      .on("tag:endform", () => stream.stop())
      .on("template", (tpl) => this.tpls.push(tpl))
      .on("end", () => {
        throw new Error("{% form %} not closed");
      });
    stream.start();
  },
  *render(ctx, emitter) {
    const kind = /'([^']+)'/.exec(this.args)?.[1] ?? "generic";
    const action = kind === "product" ? "/cart/add" : "/contact#contact_form";
    emitter.write(
      `<form method="post" action="${action}" data-preview-inert="true">` +
        `<input type="hidden" name="form_type" value="${kind}">`,
    );
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    emitter.write("</form>");
  },
});

/**
 * {% section 'name' %}
 *
 * Renders sections/<name>.liquid with its `section` object in scope. Settings
 * come from the section's own {% schema %} defaults, overridden by whatever the
 * template's JSON supplies — the same precedence Shopify applies.
 */
function readSchema(name) {
  const src = readFileSync(join(THEME, "sections", `${name}.liquid`), "utf8");
  const match = /{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/.exec(src);
  if (!match) return { settings: {}, blocks: [] };

  let parsed;
  try {
    parsed = JSON.parse(match[1]);
  } catch {
    return { settings: {}, blocks: [] };
  }

  const settings = {};
  for (const s of parsed.settings ?? []) {
    if (s.id && "default" in s) settings[s.id] = s.default;
  }
  return { settings, schema: parsed };
}

/** Section settings supplied by templates/index.json, keyed by section id. */
let templateSections = {};

engine.registerTag("section", {
  parse(token) {
    this.name = /'([^']+)'|"([^"]+)"/.exec(token.args)?.slice(1).find(Boolean);
  },
  *render(ctx, emitter) {
    const { settings: defaults, schema } = readSchema(this.name);
    const override = templateSections[this.name] ?? {};

    const blocks = (override.block_order ?? []).map((id) => ({
      id,
      type: override.blocks[id].type,
      settings: override.blocks[id].settings,
      shopify_attributes: "",
    }));

    const section = {
      id: this.name,
      settings: { ...defaults, ...(override.settings ?? {}) },
      blocks,
      // Sections with no explicit blocks still expose defaults from the schema.
      schema_name: schema?.name ?? this.name,
    };

    const src = readFileSync(join(THEME, "sections", `${this.name}.liquid`), "utf8");
    const html = yield engine.parseAndRender(src, { ...ctx.getAll(), section });
    emitter.write(html);
  },
});

/* ── Globals ──────────────────────────────────────────────── */

const baseScope = {
  shop: {
    name: "heavyskint",
    metaobjects: {
      show: { values: SHOWS },
      release: { values: RELEASES },
    },
  },
  collections: { merch: COLLECTION },
  linklists: { "main-menu": { links: MENU } },
  routes: {
    root_url: "/",
    all_products_collection_url: "/collections/merch",
  },
  settings: {},
  content_for_header: "",
  canonical_url: "http://localhost:4321/",
};

/* ── Routes ───────────────────────────────────────────────── */

const ROUTES = [
  { out: "index.html", template: "index.json", title: "heavyskint", scope: {} },
  { out: "pages/shows.html", template: "page.shows.liquid", title: "Shows", scope: {} },
  { out: "pages/music.html", template: "page.music.liquid", title: "Music", scope: {} },
  {
    out: "pages/about.html",
    template: "page.about.liquid",
    title: "About",
    scope: { page: { title: "About", content: ABOUT_CONTENT } },
  },
  { out: "pages/contact.html", template: "page.contact.liquid", title: "Contact", scope: { form: {} } },
  {
    out: "collections/merch.html",
    template: "collection.liquid",
    title: "Merch",
    scope: { collection: COLLECTION },
  },
  ...PRODUCTS.map((p) => ({
    out: `products/${p.handle}.html`,
    template: "product.liquid",
    title: p.title,
    scope: { product: p },
  })),
];

/**
 * Rewrite Shopify's extensionless URLs to the .html files this harness writes,
 * so the preview is clickable from the filesystem or any static server.
 */
function localiseLinks(html) {
  return html
    .replace(/href="\/pages\/([a-z-]+)"/g, 'href="/pages/$1.html"')
    .replace(/href="\/collections\/([a-z-]+)"/g, 'href="/collections/$1.html"')
    .replace(/href="\/products\/([a-z0-9-]+)"/g, 'href="/products/$1.html"')
    .replace(/href="\/policies\/([a-z-]+)"/g, 'href="#policy-$1"')
    .replace(/href="\/"/g, 'href="/index.html"');
}

async function main() {
  if (existsSync(OUT)) rmSync(OUT, { recursive: true });
  mkdirSync(OUT, { recursive: true });
  cpSync(join(THEME, "assets"), join(OUT, "assets"), { recursive: true });

  const layout = readFileSync(join(THEME, "layout", "theme.liquid"), "utf8");
  const indexJson = JSON.parse(readFileSync(join(THEME, "templates", "index.json"), "utf8"));

  for (const route of ROUTES) {
    let content;

    if (route.template.endsWith(".json")) {
      templateSections = indexJson.sections;
      const order = indexJson.order
        .map((id) => `{% section '${indexJson.sections[id].type}' %}`)
        .join("\n");
      // index.json keys sections by id; our tag looks them up by type name.
      templateSections = Object.fromEntries(
        Object.entries(indexJson.sections).map(([, v]) => [v.type, v]),
      );
      content = await engine.parseAndRender(order, { ...baseScope, ...route.scope });
    } else {
      templateSections = {};
      const src = readFileSync(join(THEME, "templates", route.template), "utf8");
      content = await engine.parseAndRender(src, { ...baseScope, ...route.scope });
    }

    const html = await engine.parseAndRender(layout, {
      ...baseScope,
      ...route.scope,
      page_title: route.title,
      content_for_layout: content,
    });

    const dest = join(OUT, route.out);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, localiseLinks(html));
    console.log(`  ${route.out}`);
  }

  console.log(`\nRendered ${ROUTES.length} pages to shopify-concept/out/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
