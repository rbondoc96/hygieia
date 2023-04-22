# Hygieia Contributing Guide
Hi there! Thanks for your interest in contributing to this project. Before submitting your contribution, please read through the following guide.


## Repository Setup
To develop locally, fork the Hygieia repository and clone it on your local machine. The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

To develop and test:

1. Run `pnpm i` in Hygieia's root folder.
2. Run `pnpm build` in Hygieia's root folder.


## Running Tests
All tests are stored under the `__tests__` directory. The tests are run using [Vitest](https://vitest.dev/).

Each test can be run under either dev server mode or build mode.

- `pnpm test` by default runs every integration test and unit test on the code living in the `src` directory.
- `pnpm test:build` runs tests on the build.
- `pnpm test:coverage` runs tests on the `src` code and outputs a code coverage chart to the console.
    - Code coverage is provided through Vitest via [c8](https://www.npmjs.com/package/@vitest/coverage-c8).
- `pnpm test:unit` runs all unit tests.
- `pnpm test:watch` runs tests on the `src` code in `serve` mode and watches file changes.


## Pull Request Guidelines
Check out a topic branch from a base branch (e.g. `main`) and merge back against that branch.

If adding a new feature:

- Add accompanying test cases.
- Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

If fixing a bug:

- If you are resolving a special issue, append `(fix #xxxx[,#xxxx])`, where `#xxxx` is the issue ID, to your PR title for a better release log.
    - e.g. `fix: avoid crash when project name is numeric (fix #1234)`
- Provide a detailed description of the bug in the PR. Live demo preferred.
- Add appropriate test coverage if applicable.

Make sure that all tests pass consistently and that the PR title matches the [commit message convention](https://github.com/pxeeio/hygieia/blob/main/.github/commit-convention.md).
