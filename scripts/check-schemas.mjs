// Validates every example against its schema: examples/<schema>[.<case>].json
// must pass, examples/invalid/<schema>.<case>.json must fail.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';

const SCHEMAS = ['engine', 'engines', 'engine-error'];
const BASE = 'https://github.com/toollyst/archer-releases/schema/';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
// strictRequired would reject `then: { required: [...] }`, the usual way to
// make a field required only for some kinds.
const ajv = new Ajv2020({
  strict: true,
  strictRequired: false,
  allErrors: true,
});
for (const name of SCHEMAS) {
  ajv.addSchema(read(`schema/${name}.schema.json`));
}
const validators = Object.fromEntries(
  SCHEMAS.map((name) => [name, ajv.getSchema(`${BASE}${name}.schema.json`)]),
);

const schemaOf = (file) => file.replace(/\.json$/, '').split('.')[0];
const failures = [];
let count = 0;
for (const [dir, shouldPass] of [
  ['examples', true],
  ['examples/invalid', false],
]) {
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const validate = validators[schemaOf(file)];
    if (!validate) {
      failures.push(`${dir}/${file}: no schema named ${schemaOf(file)}`);
      continue;
    }
    count += 1;
    const passed = validate(read(join(dir, file)));
    if (passed !== shouldPass) {
      const why = passed ? 'it passed' : ajv.errorsText(validate.errors);
      const want = shouldPass ? 'pass' : 'fail';
      failures.push(`${dir}/${file}: should ${want}, ${why}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`${count} examples ok`);
