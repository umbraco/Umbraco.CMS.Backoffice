import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { customElement, property } from '@umbraco-cms/backoffice/external/lit';

@customElement('umb-context-story-render')
export class UmbContextStoryRenderElement extends UmbLitElement {

	@property()
	story: any

	renderStory(story: any) {
		this.story = story;
		return this;
	}

	render() {
		return this.story ? this.story() : '';
	}
}
