# Semantic Versioning Guide

## Automatisches Versioning Setup

Dieses Projekt verwendet **Conventional Commits** und **Standard Version** für automatisches Semantic Versioning.

## Commit-Nachrichten Format

Verwende das folgende Format für Commit-Nachrichten:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit-Typen:

- **feat**: Neue Features (minor version bump)
- **fix**: Bug-Fixes (patch version bump)
- **docs**: Nur Dokumentation
- **style**: Code-Formatierung (kein Funktionsänderung)
- **refactor**: Code-Refactoring
- **perf**: Performance-Verbesserungen
- **test**: Tests hinzufügen/ändern
- **build**: Build-System/Dependencies
- **ci**: CI-Konfiguration
- **chore**: Andere Änderungen
- **revert**: Commit rückgängig machen

### Breaking Changes:

Für **major version bumps** verwende:
```
feat!: breaking change description
```
oder
```
feat: description

BREAKING CHANGE: detailed description
```

## Verwendung

### Interaktive Commits (empfohlen):
```bash
npm run commit
```

### Normale Commits:
```bash
git commit -m "feat: add new calendar feature"
```

### Releases erstellen:
```bash
# Automatisches Versioning basierend auf Commits
npm run release

# Spezifische Version
npm run release:major
npm run release:minor
npm run release:patch
```

## Git-Hooks

- **pre-commit**: Führt Tests aus
- **pre-push**: Führt Type-Checking aus
- **commit-msg**: Validiert Commit-Nachrichten

## Beispiele

```bash
# Feature hinzufügen
git commit -m "feat: add driver statistics tab"

# Bug-Fix
git commit -m "fix: resolve calendar date formatting issue"

# Breaking Change
git commit -m "feat!: change API response structure"

# Mit Scope
git commit -m "feat(calendar): add race session filtering"
```

## Version erstellen und veröffentlichen

```bash
# 1. Alle Änderungen committen
git add .
npm run commit

# 2. Release erstellen
npm run release

# 3. Tags und Commits pushen
git push --follow-tags origin main
```

Das wird automatisch:
- Version in package.json aktualisieren
- CHANGELOG.md aktualisieren
- Git-Tag erstellen
- Release-Commit machen
