# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v0.1.8] - 2026-04-16

### Fixes
- fix(arjostyle-web): resolve type check errors

### Chores
- bump to v0.1.7 + regenerate changelog

### Other
- chore(deps): add semver for version bump skill

## [v0.1.7] - 2026-04-15

### Fixes
- fix(arjostyle-web): resolve type check errors

## [v0.1.6] - 2026-04-14

### Fixes
- bake APP_VERSION into worker at build time via version.ts
- use $VERSION shell var instead of ${{ env.VERSION }} in sed command
- fetch full git history so git describe --tags finds all tags
