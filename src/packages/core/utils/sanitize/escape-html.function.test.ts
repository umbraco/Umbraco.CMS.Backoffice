import { expect } from '@open-wc/testing';
import { escapeHTML } from './escape-html.function.js';

describe('escapeHtml', () => {
	it('should escape html', () => {
		expect(escapeHTML('<script>alert("XSS")</script>')).to.equal('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
	});

	it('should escape html with single quotes', () => {
		expect(escapeHTML("<script>alert('XSS')</script>")).to.equal('&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;');
	});

	it('should escape html with mixed quotes', () => {
		expect(escapeHTML("<script>alert('XSS')</script>")).to.equal('&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;');
	});
});
