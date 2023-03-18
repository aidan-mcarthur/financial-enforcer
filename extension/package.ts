import archiver from 'archiver'
import * as fs from 'fs'
import * as process from 'process'

const args = process.argv.slice(2)

if (args.length !== 1) {
  console.error('Please specify the commit hash as an argument.')
  process.exit(1)
}

const commitHash = args[0]

const manifest = fs.readFileSync('package/manifest.json', 'utf8')
const manifestObj = JSON.parse(manifest)
const version = manifestObj.version as string
const fullVersion = `${version}-${commitHash}`

const sourceDir = 'dist'

const output = fs.createWriteStream(`financial-enforcer-${fullVersion}.zip`)
const archive = archiver('zip')

archive.on('error', function (err: any) {
  throw err
})

archive.pipe(output)
archive.directory(sourceDir, false)
archive.finalize()
