import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { property } from '@umbraco-cms/backoffice/external/lit';

export class UmbContextStoryRenderElement extends UmbLitElement {

	@property()
	story: any

	renderStory(story) {
		this.story = story;
		return this;
	}

	render() {
		return this.story ? this.story() : '';
	}
}
