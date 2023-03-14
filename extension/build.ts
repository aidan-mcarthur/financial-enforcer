import * as esbuild from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'

const getAllFilesInDirectory = (directory: string): string[] => {
  const files: string[] = []
  fs.readdirSync(directory).forEach((file: string) => {
    const absolutePath = path.join(directory, file)
    if (fs.statSync(absolutePath).isDirectory()) {
      files.push(...getAllFilesInDirectory(absolutePath))
    } else {
      files.push(absolutePath)
    }
  })
  return files
}

async function build() {
  fs.rmSync('dist', { recursive: true, force: true })
  fs.mkdirSync('dist', { recursive: true })

  await esbuild.build({
    entryPoints: ['src/content-script.ts', 'src/background.ts'],
    bundle: true,
    minify: true,
    keepNames: true,
    sourcemap: true,
    sourcesContent: false,
    target: 'chrome58',
    outdir: 'dist',
  })

  const packageFiles = getAllFilesInDirectory('package')

  for (const file of packageFiles) {
    const destPath = file.replace('package', 'dist')
    const destDir = path.dirname(destPath)
    fs.mkdirSync(destDir, { recursive: true })
    fs.copyFileSync(file, destPath)
  }
}

build()
