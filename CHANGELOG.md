# Changelog

## [1.4.0](https://github.com/leaveanest/slack-utils/compare/v1.3.0...v1.4.0) (2025-10-24)


### Features

* add exception handling rules for API and validation ([602898c](https://github.com/leaveanest/slack-utils/commit/602898c4d59d847b0ffc0f2a7ac4f66ee3c510cb))

## [1.3.0](https://github.com/leaveanest/slack-utils/compare/v1.2.0...v1.3.0) (2025-10-24)


### Features

* enhance VSCode settings with comprehensive development environment ([14487e9](https://github.com/leaveanest/slack-utils/commit/14487e9e20a0dc6498d7913cfe8c26ac68760da1))


### Bug Fixes

* add settings.json to version control for team consistency ([bc9d563](https://github.com/leaveanest/slack-utils/commit/bc9d563c539412a3c4bc61c8c201301d1c682512))
* downgrade first-interaction action from v3 to v1 ([9e331ed](https://github.com/leaveanest/slack-utils/commit/9e331edbf0a943f631ebb4c46757332ee2cbb73a))

## [1.2.0](https://github.com/leaveanest/slack-utils/compare/v1.1.0...v1.2.0) (2025-10-24)


### Features

* **i18n:** implement multi-language support and automatic translation ([16f1c8c](https://github.com/leaveanest/slack-utils/commit/16f1c8c7f0d74951c3afac7069709530c375065d))


### Bug Fixes

* **ci:** update i18n workflows to use Deno v2.x ([4463e30](https://github.com/leaveanest/slack-utils/commit/4463e302aa27e80c5577c4e800e2d8d0d16c4853))
* **i18n:** disable sanitizers for i18n tests ([fcc300a](https://github.com/leaveanest/slack-utils/commit/fcc300a6dd5e81403401d686305c564dfcc34cd8))
* **i18n:** use import_map for test imports ([f51ba73](https://github.com/leaveanest/slack-utils/commit/f51ba733f5f15c32b2667f8a44370e833c40da20))
* **test:** disable sanitizers for all i18n-related tests ([cd621e0](https://github.com/leaveanest/slack-utils/commit/cd621e0bc540c6ffef998ed8b9dfab4924176042))

## [1.1.0](https://github.com/leaveanest/slack-utils/compare/v1.0.2...v1.1.0) (2025-10-20)


### Features

* upgrade Slack Deno SDK to latest versions and fix Deno 2.0 compatibility ([6954b29](https://github.com/leaveanest/slack-utils/commit/6954b2920fb647967a8b0bdcac3618010fbdfe3f))

## [1.0.2](https://github.com/leaveanest/slack-utils/compare/v1.0.1...v1.0.2) (2025-10-17)


### Bug Fixes

* exclude CHANGELOG.md from format checking ([9b212bb](https://github.com/leaveanest/slack-utils/commit/9b212bb9a531e6ea7644e43b2caed342f84543d6))
* remove \n from Slack notification messages ([cdb9d39](https://github.com/leaveanest/slack-utils/commit/cdb9d396feeea69ae47aa2f1448ed5e77f901f2e))

## [1.0.1](https://github.com/leaveanest/slack-utils/compare/v1.0.0...v1.0.1) (2025-10-17)


### Bug Fixes

* handle semantic-release default export correctly ([0a1352b](https://github.com/leaveanest/slack-utils/commit/0a1352b620757725da71c87124211c6d465f1b14))

## 1.0.0 (2025-10-17)

### Bug Fixes

- add actions:read permission to security workflow
  ([d7b8c90](https://github.com/leaveanest/slack-utils/commit/d7b8c90a3c29ae72b145bcc6f9013ea48443cea6))
- remove SARIF upload for private repository
  ([1e55225](https://github.com/leaveanest/slack-utils/commit/1e552255ff2f510298ad8a523e68c06819c98212))
- update Slack channel name to
  [#05](https://github.com/leaveanest/slack-utils/issues/05)-miyazawa
  ([50f7036](https://github.com/leaveanest/slack-utils/commit/50f7036e3133df71a40876e1511ffbf699cc4dc1))
