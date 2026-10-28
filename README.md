# Archer releases

Released versions of the Archer game engine, and the formats the Archer Hub reads to install them.

## Formats

| Schema | File | What it is |
|---|---|---|
| [engine.schema.json](schema/engine.schema.json) | `engine.json` inside an installed version | What that version says about itself (`Archer --describe`): version, project formats it reads and writes, editor path, templates, shipped script toolchains |
| [engines.schema.json](schema/engines.schema.json) | `engines.json` on the latest release, signed as `engines.json.minisig` | Every released version with its editor bundle per host and export runtime bundle per target (`tar.zst`, size, SHA-256) |
| [engine-error.schema.json](schema/engine-error.schema.json) | One line on stderr | Why `Archer --open` or `Archer --new` failed |

Every file has a `version` field; readers reject versions they do not know, and a change to a format raises it.

## Versions

`0.x.y`: a minor release may raise the project format; a patch release never does.

## Checking

```bash
pnpm install
pnpm check   # Biome, then every file in examples/ must pass and every file in examples/invalid/ must fail
```
