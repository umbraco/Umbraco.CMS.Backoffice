# Umbraco.CMS.Backoffice

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

## Manifests

The new WebComponent based backoffice is made up of components which are the same building blocks that is available to all developers to do the same customisations.

Component | Description
 --- | ---
CollectionBulkAction | When a collection of items are selected, this is the bulk action that is available such as Copy, Delete, Move etc
CollectionView | A custom view for display a collection of items such as content items in list view.
Dashboard | A dashboard that is visible in a specific section of the backoffice.
DashboardCollection | A dashboard to display a specific entity from a store as a collection of items that use the CollectionView's and CollectionBulkAction's
ExternalLoginProvider | Adds a custom login provider such as Github, Google etc to the user dialog that slides out when the user avatar is clicked in the top right corner.
HeaderApp | The user avatar and the search icon in the top right are both 'Header Apps' where more can be added.
PropertyAction | On a specific property editor on the label three dots are visible to show further actions such as Copy and Clear etc.
PropertyEditorModel | x
PropertyEditorUI | x
Section | Sections or apps inside the backoffice such as Content, Media, Settings, Packages etc
SectionView | Section views was previously known as Content/Context apps. Examples are Created Packages, Content Info etc
SidebarMenuItem | Adds items to the sidebar/tree. Note this does not need to have an associated tree manifest, for example the Log Viewer has an entry in the sidebar but no child tree items.
Tree | A tree used inside a section on the left hand side that is backed by a store, however without the SidebarMenuItem registration it will not be visible in the sidebar.
TreeItemAction | For any items in a tree, three dots can appear to show more actions. In the content tree this is for things such as Copy, Move, Delete etc
UserDashboard | Adds a custom dashboard to the user dialog that slides out when the user avatar is clicked in the top right corner.
Workspace | This is the main section/workspace of the backoffice to the right of the sidebar/tree. Examples of workspaces are editing content, viewing logs in the log viewer etc
WorkspaceAction | This adds actions/buttons to a workspace such as Save, Save and Publish etc
WorkspaceView | This is a view used inside a workspace used in conjuction with SectionView's that is main view when the Context/Content app is viewed.
WorkspaceViewCollection | This is the same as WorkspaceView however its specfic to displaying a entity from a store as a collection of items that use the CollectionView's and CollectionBulkAction's
