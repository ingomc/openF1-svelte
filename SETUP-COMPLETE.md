# 🏁 Formula 1 Dashboard - Semantic Versioning Setup

## ✅ Installation erfolgreich abgeschlossen!

Das automatische Semantic Versioning wurde erfolgreich eingerichtet. Die App ist jetzt auf Version **1.0.0** und bereit für die Entwicklung.

## 🔧 Was wurde eingerichtet:

### 1. **Commitlint** - Validierung von Commit-Nachrichten
- Konfiguration: `.commitlintrc.json`
- Folgt Conventional Commits Standard
- Validiert Commit-Nachrichten automatisch

### 2. **Husky** - Git-Hooks
- **pre-commit**: Führt automatisch Tests aus
- **commit-msg**: Validiert Commit-Nachrichten
- **pre-push**: Führt Type-Checking aus

### 3. **Standard-Version** - Automatische Versionierung
- Konfiguration: `.versionrc.json`
- Erstellt automatisch CHANGELOG.md
- Bumpt Versionen basierend auf Commit-Typen

### 4. **Commitizen** - Interaktive Commits
- Hilft bei der Erstellung von conventional commits
- Verwendung: `npm run commit`

## 🚀 Verwendung:

### Normale Entwicklung:
```bash
# 1. Änderungen machen
git add .

# 2. Commit mit Standard-Nachricht
git commit -m "feat: neue Funktion hinzugefügt"

# 3. Oder interaktiv
npm run commit
```

### Release erstellen:
```bash
# Automatische Versionierung
npm run release

# Spezifische Version
npm run release:major    # 1.0.0 → 2.0.0
npm run release:minor    # 1.0.0 → 1.1.0
npm run release:patch    # 1.0.0 → 1.0.1
```

### Commit-Typen:
- `feat:` - Neue Features (minor bump)
- `fix:` - Bug-Fixes (patch bump)
- `feat!:` oder `BREAKING CHANGE:` - Breaking Changes (major bump)
- `docs:`, `style:`, `refactor:`, `test:`, `chore:` - No version bump

## 🎯 Workflow-Beispiel:

```bash
# 1. Feature entwickeln
git checkout -b feature/new-dashboard

# 2. Änderungen committen
git add .
git commit -m "feat: add new dashboard tab"

# 3. Zurück zu main
git checkout main
git merge feature/new-dashboard

# 4. Release erstellen
npm run release

# 5. Tags und Commits pushen
git push --follow-tags origin main
```

## 📋 Verfügbare Scripts:

```json
{
  "dev": "vite",                    // Entwicklungsserver
  "build": "vite build",            // Production Build
  "test": "vitest",                 // Tests im Watch-Mode
  "test:run": "vitest run",         // Tests einmalig
  "release": "standard-version",    // Automatisches Release
  "release:major": "...",           // Major Version
  "release:minor": "...",           // Minor Version
  "release:patch": "...",           // Patch Version
  "commit": "git-cz"                // Interaktiver Commit
}
```

## 📖 Weitere Informationen:

- **Detaillierte Anleitung**: `VERSIONING.md`
- **Changelog**: `CHANGELOG.md`
- **Tests**: `tests/utils.test.ts`

---

**🎉 Das Setup ist vollständig und produktionsbereit!**

Das F1 Dashboard ist jetzt mit einem professionellen Semantic Versioning Workflow ausgestattet, der automatisch Versionen verwaltet, Tests ausführt und Releases erstellt.
