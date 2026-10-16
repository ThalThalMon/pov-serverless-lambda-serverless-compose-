# Review service

- `GET /review-v1` returns reviews without ratings.
- `GET /review-v2` and `GET /review-v3` fetch ratings from rating-service.

Serverless Compose supplies the rating endpoint as `RATINGS_URL`. Deploy from
the project root with `serverless deploy`. See the [project README](../README.md)
for the architecture and deployment flow.
