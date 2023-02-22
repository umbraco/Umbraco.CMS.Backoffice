import { expect } from '@open-wc/testing';
import { UmbContextConsumer } from '../consume/context-consumer';
import { UmbContextRequestEventImplementation } from '../consume/context-request.event';
import { UmbContextProvider } from './context-provider';

class MyClass {
	prop = 'value from provider';
}

describe('UmbContextProvider', () => {
	let instance: MyClass;
	let provider: UmbContextProvider;

	beforeEach(() => {
		instance = new MyClass();
		provider = new UmbContextProvider(document.body, 'my-test-context', instance);
		provider.hostConnected();
	});

	afterEach(async () => {
		provider.hostDisconnected();
	});

	describe('Public API', () => {
		describe('properties', () => {
			it('has a host property', () => {
				expect(provider).to.have.property('host');
			});
		});

		describe('methods', () => {
			it('has an attach method', () => {
				expect(provider).to.have.property('hostConnected').that.is.a('function');
			});

			it('has a detach method', () => {
				expect(provider).to.have.property('hostDisconnected').that.is.a('function');
			});
		});
	});

	it('handles context request events', (done) => {
		const event = new UmbContextRequestEventImplementation('my-test-context', (_instance: MyClass) => {
			expect(_instance.prop).to.eq('value from provider');
			done();
		});

		document.body.dispatchEvent(event);
	});

	it('works with UmbContextConsumer', (done) => {
		const element = document.createElement('div');
		document.body.appendChild(element);

		const localConsumer = new UmbContextConsumer(element, 'my-test-context', (_instance: MyClass) => {
			expect(_instance.prop).to.eq('value from provider');
			done();
			localConsumer.hostDisconnected();
		});
		localConsumer.hostConnected();
	});
});
