import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import ts from 'typescript'

/** Small loader for standalone checks of the typed content contract. */
export function loadTypescript(file, mocks = {}) {
  const module = { exports: {} }
  const code = ts.transpileModule(readFileSync(resolve(file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const require = name => {
    if (Object.hasOwn(mocks, name)) return mocks[name]
    throw new Error(`Unexpected runtime dependency ${name} in ${file}`)
  }
  new Function('require', 'module', 'exports', code)(require, module, module.exports)
  return module.exports
}
