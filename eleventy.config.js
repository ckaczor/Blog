import {
	IdAttributePlugin,
	InputPathToUrlTransformPlugin,
	HtmlBasePlugin
} from '@11ty/eleventy';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginNavigation from '@11ty/eleventy-navigation';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

import pluginFilters from './_config/filters.js';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	// Drafts, see also _data/eleventyDataSchema.js
	eleventyConfig.addPreprocessor('drafts', '*', (data, content) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === 'build') {
			return false;
		}
	});

	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig
		.addPassthroughCopy({
			'./public/': '/'
		})
		.addPassthroughCopy('./content/blog/**/images/*')
		.addPassthroughCopy("./content/img/**/*");

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget('content/blog/**/*.md');
	eleventyConfig.addWatchTarget('content/blog/**/*.{svg,webp,png,jpeg}');

	// Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
	// Adds the {% css %} paired shortcode
	eleventyConfig.addBundle('css', {
		toFileDirectory: 'dist'
	});
	// Adds the {% js %} paired shortcode
	eleventyConfig.addBundle('js', {
		toFileDirectory: 'dist'
	});

	eleventyConfig.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: '<!-- excerpt -->'
	});

	// Official plugins
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

	eleventyConfig.addPlugin(feedPlugin, {
		type: 'atom',
		outputPath: '/feed/feed.xml',
		collection: {
			name: 'posts',
			limit: 10
		},
		metadata: {
			language: 'en',
			title: 'Chris Kaczor',
			subtitle: 'Code, Critters, and whatever I feel like writing about.',
			base: 'https://chriskaczor.com/',
			author: {
				name: 'Chris Kaczor'
			}
		}
	});

	// Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// File extensions to process in _site folder
		extensions: 'html',

		// Output formats for each image.
		formats: ['avif', 'webp', 'auto'],

		// widths: ["auto"],

		defaultAttributes: {
			// e.g. <img loading decoding> assigned on the HTML tag will override these values.
			loading: 'lazy',
			decoding: 'async'
		}
	});

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	eleventyConfig.addPlugin(IdAttributePlugin, {
		// by default we use Eleventy’s built-in `slugify` filter:
		// slugify: eleventyConfig.getFilter("slugify"),
		// selector: "h1,h2,h3,h4,h5,h6", // default
	});

	eleventyConfig.addShortcode('currentBuildDate', () => {
		return new Date().toISOString();
	});

	eleventyConfig.amendLibrary('md', (mdLib) => {
		var defaultImageRender = mdLib.renderer.rules.image;

		mdLib.renderer.rules.image = function (
			tokens,
			idx,
			options,
			env,
			self
		) {
			const token = tokens[idx];
			const aIndex = token.attrIndex('src');
			const link = token.attrs[aIndex][1];

			if (/(http(s?)):\/\//i.test(link)) {
				// Ignore
			} else {
				tokens[idx].attrs[aIndex][1] = env.page.url + link;
			}

			return defaultImageRender(tokens, idx, options, env, self);
		};

		var defaultLinkOpenRender =
			mdLib.renderer.rules.link_open ||
			function (tokens, idx, options, env, self) {
				return self.renderToken(tokens, idx, options);
			};

		mdLib.renderer.rules.link_open = function (
			tokens,
			idx,
			options,
			env,
			self
		) {
			const token = tokens[idx];
			const aIndex = token.attrIndex('href');
			const link = token.attrs[aIndex][1];

			if (/(http(s?)):\/\//i.test(link)) {
				// Ignore
			} else {
				tokens[idx].attrs[aIndex][1] = env.page.url + link;
			}

			return defaultLinkOpenRender(tokens, idx, options, env, self);
		};
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
}

export const config = {
	// Control which files Eleventy will process
	// e.g.: *.md, *.njk, *.html, *.liquid
	templateFormats: ['md', 'njk', 'html', 'liquid', '11ty.js'],

	// Pre-process *.md files with: (default: `liquid`)
	markdownTemplateEngine: 'njk',

	// Pre-process *.html files with: (default: `liquid`)
	htmlTemplateEngine: 'njk',

	// These are all optional:
	dir: {
		input: 'content', // default: "."
		includes: '../_includes', // default: "_includes" (`input` relative)
		data: '../_data', // default: "_data" (`input` relative)
		output: '_site'
	}

	// -----------------------------------------------------------------
	// Optional items:
	// -----------------------------------------------------------------

	// If your site deploys to a subdirectory, change `pathPrefix`.
	// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

	// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
	// it will transform any absolute URLs in your HTML to include this
	// folder name and does **not** affect where things go in the output folder.

	// pathPrefix: "/",
};