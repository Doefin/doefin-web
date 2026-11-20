import { spawn } from 'node:child_process'

const args = process.argv.slice(2).map(argument => {
  if (argument === '--host') return '--hostname'
  if (argument.startsWith('--host=')) return '--hostname=' + argument.slice('--host='.length)
  return argument
})

const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', ...args], {
  stdio: 'inherit',
  env: process.env,
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}

child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0)
})
