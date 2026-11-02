# npm releases

The four packages now use one coordinated Icons release version:

- `@neural-icons/core`
- `@neural-icons/angular`
- `@neural-icons/react`
- `@neural-icons/vue`

Pedro prepares the version with `npm run release:prepare -- <version>`, reviews the PR, then pushes the single `core@<version>` tag from the reviewed `main` history. Core is published first, followed by the three adapters and the matching showcase. No separate adapter tags are required.

See [coordinated releases](coordinated-releases.md) for verification, npm Trusted Publisher configuration, retry behavior, protected publication and deployment to the existing URLs.

Historical independent package tags and published versions, including `1.1.1` and `0.0.1-next.2`, remain unchanged. The package names and public npm URLs are preserved.
