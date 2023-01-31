# Umbraco.CMS.Backoffice

[![Storybook](https://github.com/umbraco/Umbraco.CMS.Backoffice/actions/workflows/azure-static-web-apps-ambitious-stone-0033b3603.yml/badge.svg)](https://github.com/umbraco/Umbraco.CMS.Backoffice/actions/workflows/azure-static-web-apps-ambitious-stone-0033b3603.yml)
|
[![Static Web App](https://github.com/umbraco/Umbraco.CMS.Backoffice/actions/workflows/azure-static-web-apps-ashy-bay-09f36a803.yml/badge.svg)](https://github.com/umbraco/Umbraco.CMS.Backoffice/actions/workflows/azure-static-web-apps-ashy-bay-09f36a803.yml)

## Installation instructions

1. Run `npm install`
2. Run `npm run dev` to launch Vite in dev mode

### Environment variables

The development environment supports `.env` files, so in order to set your own make a copy
of `.env` and name it `.env.local` and set the variables you need.

As an example to show the installer instead of the login screen, set the following
in the `.env.local` file to indicate that Umbraco has not been installed:

```bash
VITE_UMBRACO_INSTALL_STATUS=must-install
```

## Environments

### Development

The development environment is the default environment and is used when running `npm run dev`. All API calls are mocked and the Umbraco backoffice is served from the `src` folder.

### Run against a local Umbraco instance

Create a `.env.local` file and set the following variables:

```bash
VITE_UMBRACO_API_URL=http://localhost:5000 # This will be the URL to your Umbraco instance
VITE_UMBRACO_USE_MSW=off # Indicate that you want all API calls to bypass MSW (mock-service-worker)
```

### Static website

See the Main branch in action here as an [Azure Static Web App](https://ashy-bay-09f36a803.1.azurestaticapps.net/). The deploy runs automatically every time the `main` branch is updated. It uses mocked responses from the Umbraco API to simulate the site just like the local development environment.

### Storybook

Storybook is also being built and deployed automatically on the Main branch, including a preview URL on each pull request. See it in action on this [Azure Static Web App](https://ambitious-stone-0033b3603.1.azurestaticapps.net/).

## Contributing

We accept contributions to this project. However be aware that we are mainly working on a private backlog, so not everyone will be immediately obvious. If you want to get started on contributing, please read the [contribute space](https://github.com/umbraco/Umbraco.CMS.Backoffice/contribute) where you will be able to find the guidelines on how to contribute as well as a list of good first issues.
