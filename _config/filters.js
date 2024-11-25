import { DateTime } from 'luxon';
import markdownIt from 'markdown-it';

export default function (eleventyConfig) {
	eleventyConfig.addFilter('readableDate', (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || 'utc' }).toFormat(
			format || 'dd LLLL yyyy'
		);
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
			'yyyy-LL-dd'
		);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter('getKeys', (target) => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter('filterTagList', function filterTagList(tags) {
		return (tags || []).filter(
			(tag) => ['all', 'posts'].indexOf(tag) === -1
		);
	});

	eleventyConfig.addFilter('md', function (content = '') {
		return markdownIt({ html: true }).render(content);
	});
}