import { rest } from "msw";
import { umbracoPath } from "@umbraco-cms/utils";
import { OEmbedResult, OEmbedStatus } from "src/core/modal/layouts/embedded-media/modal-layout-embedded-media.element";

export const handlers = [
	rest.get(umbracoPath('/rteembed'), (req, res, ctx) => {
		const response: OEmbedResult = {
			supportsDimensions: true,
			markup: '<iframe width="360" height="203" src="https://www.youtube.com/embed/wJNbtYdr-Hg?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen title="Sleep Token - The Summoning"></iframe>',
			oEmbedStatus: OEmbedStatus.Success,			
		};

		return res(ctx.status(200), ctx.json(response));
	}),
];