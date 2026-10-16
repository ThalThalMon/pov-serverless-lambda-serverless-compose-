# Storefront

`GET /storefront` serves `index.html`; `GET /storefront-data?version=1|2|3` aggregates menu and the selected review version.

The browser page has v1/v2/v3 review controls. Review-service v1 has no ratings; v2 and v3 include ratings from rating-service. When deployed with Serverless Compose from the project root, the menu and review API base URLs are supplied automatically. See the [coffee shop README](../README.md) for architecture and deployment instructions.
