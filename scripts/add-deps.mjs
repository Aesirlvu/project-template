#!/usr/bin/env node
/**
 * Add custom dependencies on top of an existing project.
 *
 * The registry items merge their own dependencies into package.json, but every
 * project has different needs. This script lets you layer arbitrary packages
 * on top of the base setup without editing package.json by hand.
 *
 * Usage:
 *   node scripts/add-deps.mjs <package>[@version] [package...]
 *   node scripts/add-deps.mjs --dev <package>[@version] [package...]
 *   node scripts/add-deps.mjs --list
 *
 * Examples:
 *   node scripts/add-deps.mjs zustand
 *   node scripts/add-deps.mjs zustand@^5.0.15 react-hook-form@^7.86.0
 *   node scripts/add-deps.mjs --dev vitest@^4.1.11
 *   node scripts/add-deps.mjs --list
 */

import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const args = process.argv.slice(2)

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0])
  process.exit(0)
}

const root = process.cwd()
const packageJsonPath = resolve(root, "package.json")

if (!existsSync(packageJsonPath)) {
  console.error(`No package.json found in ${root}.`)
  process.exit(1)
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"))

if (args.includes("--list")) {
  const runtime = Object.keys(packageJson.dependencies ?? {}).sort()
  const dev = Object.keys(packageJson.devDependencies ?? {}).sort()
  console.log("dependencies:")
  for (const name of runtime) console.log(`  ${name}@${packageJson.dependencies[name]}`)
  console.log("devDependencies:")
  for (const name of dev) console.log(`  ${name}@${packageJson.devDependencies[name]}`)
  process.exit(0)
}

const devFlag = args.includes("--dev")
const packages = args.filter((arg) => arg !== "--dev")

if (packages.length === 0) {
  console.error("No packages provided. Use --list to inspect installed dependencies.")
  process.exit(1)
}

const target = devFlag ? "--save-dev" : "--save"
const command = process.env.npm_execpath ? process.env.npm_execpath : "npm"
const argv = process.env.npm_execpath
  ? ["install", ...packages, target]
  : ["install", ...packages, target]

console.log(`Installing ${packages.length} package(s) as ${devFlag ? "devDependencies" : "dependencies"}...`)

const result = spawnSync(command, argv, { cwd: root, stdio: "inherit" })

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
