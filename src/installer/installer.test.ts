import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import { UmbInstallerConsent } from './installer-consent.element';
import { UmbInstallerDatabase } from './installer-database.element';
import { UmbInstallerInstalling } from './installer-installing.element';
import { UmbInstallerLayout } from './installer-layout.element';
import { UmbInstallerUser } from './installer-user.element';
import { UmbInstaller } from './installer.element';

describe('UmbInstaller', () => {
  let element: UmbInstaller;

  beforeEach(async () => {
    element = await fixture(html`<umb-installer></umb-installer>`);
  });

  it('is defined with its own instance', async () => {
    expect(element).to.be.instanceOf(UmbInstaller);
  });

  it('passes the a11y audit', async () => {
    expect(element).shadowDom.to.be.accessible();
  });
});

describe('UmbInstallerLayout', () => {
  let element: UmbInstallerLayout;

  beforeEach(async () => {
    element = await fixture(html`<umb-installer-layout></umb-installer-layout>`);
  });

  it('is defined with its own instance', async () => {
    expect(element).to.be.instanceOf(UmbInstallerLayout);
  });

  it('passes the a11y audit', async () => {
    expect(element).shadowDom.to.be.accessible();
  });
});

//TODO: find a way to test the other elements: user, database, consent and installing.
