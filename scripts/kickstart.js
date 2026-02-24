const fs = require('fs')
const path = require('path')
const readline = require('readline')

// eslint-disable-next-line no-undef
const rootDir = path.join(__dirname, '..')

function getJSON(filePath) {
  const fullPath = path.join(rootDir, filePath)
  if (!fs.existsSync(fullPath)) return {}
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'))
}

const currentConfig = getJSON('app.json').expo || {}

async function run() {
  let [newName, newSlug, newBundleId] = process.argv.slice(2)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = (query) => new Promise((resolve) => rl.question(query, resolve))

  if (!newName || !newSlug || !newBundleId) {
    console.log('--- 🍐 RN Pear Expo Starter: Kickstart ---')
    newName = (await question(`App Name (${currentConfig.name}): `)) || currentConfig.name
    newSlug = (await question(`App Slug (${currentConfig.slug}): `)) || currentConfig.slug
    const defaultBundle = currentConfig.ios?.bundleIdentifier || 'com.anonymous.app'
    newBundleId = (await question(`Bundle ID / Package Name (${defaultBundle}): `)) || defaultBundle
  }

  const shouldTransform = await question(
    '\nTransform to a fresh project (replaces README)? (y/n): ',
  )
  const isTransform = shouldTransform.toLowerCase() === 'y'

  const shouldCleanUI = await question('Clean template UI structure (index.tsx)? (y/n): ')
  const isCleanUI = shouldCleanUI.toLowerCase() === 'y'

  function updateJSON(filePath, updateFn) {
    const fullPath = path.join(rootDir, filePath)
    if (!fs.existsSync(fullPath)) return
    const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
    updateFn(content)
    fs.writeFileSync(fullPath, JSON.stringify(content, null, 2) + '\n')
    console.log(`Updated ${filePath}`)
  }

  function replaceInFile(filePath, regex, replacement) {
    const fullPath = path.join(rootDir, filePath)
    if (!fs.existsSync(fullPath)) return
    let content = fs.readFileSync(fullPath, 'utf8')
    content = content.replace(regex, replacement)
    fs.writeFileSync(fullPath, content)
    console.log(`Updated ${filePath}`)
  }

  function renameNativeFoldersAndFiles(newBundle, newScheme, newAppName) {
    const buildGradlePath = path.join(rootDir, 'android/app/build.gradle')
    if (!fs.existsSync(buildGradlePath)) return

    const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8')
    const match = buildGradleContent.match(/namespace\s+['"]([^'"]+)['"]/)
    if (!match) return
    const oldBundle = match[1]

    if (oldBundle === newBundle) return

    console.log(`\nRenaming native package from ${oldBundle} to ${newBundle}...`)

    const oldScheme = 'rnpearexpostarter'
    const oldProjectName = 'RNPearExpoStarter'
    const newProjectName = newScheme // Using scheme for project name simplicity
    const oldAppName = 'RN Pear Expo Starter'

    const replaceInDir = (dir) => {
      if (!fs.existsSync(dir)) return
      const files = fs.readdirSync(dir)
      const excludeDirs = ['build', '.cxx', 'Pods']
      for (const file of files) {
        if (excludeDirs.includes(file)) continue
        const fullPath = path.join(dir, file)
        if (fs.statSync(fullPath).isDirectory()) {
          replaceInDir(fullPath)
        } else {
          try {
            const ext = path.extname(fullPath)
            const allowedExts = [
              '.java',
              '.kt',
              '.xml',
              '.gradle',
              '.h',
              '.m',
              '.mm',
              '.pbxproj',
              '.plist',
              '.cpp',
              '.xcscheme',
              '.xcworkspacedata',
              '', // Some pod files might not have extension, but let's stick to safe extensions
            ]
            if (!allowedExts.includes(ext) && file !== 'project.pbxproj' && file !== 'Podfile')
              continue

            let content = fs.readFileSync(fullPath, 'utf8')
            let changed = false
            if (content.includes(oldBundle)) {
              content = content.replace(new RegExp(oldBundle, 'g'), newBundle)
              changed = true
            }
            if (content.includes(oldScheme)) {
              content = content.replace(new RegExp(oldScheme, 'g'), newScheme)
              changed = true
            }
            if (content.includes(oldProjectName)) {
              content = content.replace(new RegExp(oldProjectName, 'g'), newProjectName)
              changed = true
            }
            if (content.includes(oldAppName)) {
              content = content.replace(new RegExp(oldAppName, 'g'), newAppName)
              changed = true
            }

            if (changed) {
              fs.writeFileSync(fullPath, content)
            }
          } catch (_) {
            // ignore
          }
        }
      }
    }

    replaceInDir(path.join(rootDir, 'android'))
    replaceInDir(path.join(rootDir, 'ios'))

    // Rename folders/files in iOS based on RNPearExpoStarter
    const renamePaths = (dir) => {
      if (!fs.existsSync(dir)) return
      const files = fs.readdirSync(dir)
      for (const file of files) {
        if (file === 'Pods' || file === 'build' || file === '.cxx') continue
        const fullPath = path.join(dir, file)
        if (fs.statSync(fullPath).isDirectory()) {
          renamePaths(fullPath)
        }
        if (file.includes(oldProjectName)) {
          const newFileName = file.replace(new RegExp(oldProjectName, 'g'), newProjectName)
          const newFullPath = path.join(dir, newFileName)

          if (
            fs.existsSync(newFullPath) &&
            fs.statSync(newFullPath).isDirectory() &&
            fs.statSync(fullPath).isDirectory()
          ) {
            const moveFiles = (src, dest) => {
              if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
              for (const item of fs.readdirSync(src)) {
                const sPath = path.join(src, item)
                const dPath = path.join(dest, item)
                if (fs.statSync(sPath).isDirectory()) {
                  moveFiles(sPath, dPath)
                } else {
                  fs.renameSync(sPath, dPath)
                }
              }
            }
            moveFiles(fullPath, newFullPath)
            fs.rmSync(fullPath, { recursive: true, force: true })
          } else {
            fs.renameSync(fullPath, newFullPath)
          }
        }
      }
    }
    renamePaths(path.join(rootDir, 'ios'))

    const oldPathParts = oldBundle.split('.')
    const newPathParts = newBundle.split('.')

    ;['main', 'debug'].forEach((variant) => {
      const oldJavaDir = path.join(rootDir, `android/app/src/${variant}/java`, ...oldPathParts)
      const newJavaDir = path.join(rootDir, `android/app/src/${variant}/java`, ...newPathParts)

      if (fs.existsSync(oldJavaDir) && oldJavaDir !== newJavaDir) {
        fs.mkdirSync(newJavaDir, { recursive: true })
        const files = fs.readdirSync(oldJavaDir)
        for (const f of files) {
          fs.renameSync(path.join(oldJavaDir, f), path.join(newJavaDir, f))
        }
        let currOld = oldJavaDir
        const baseJavaDir = path.join(rootDir, `android/app/src/${variant}/java`)
        while (currOld !== baseJavaDir && currOld.length > baseJavaDir.length) {
          if (fs.existsSync(currOld) && fs.readdirSync(currOld).length === 0) {
            fs.rmdirSync(currOld)
          }
          currOld = path.dirname(currOld)
        }
      }
    })
    console.log('✅ Native files updated.')
  }

  // 1. Update app.json
  updateJSON('app.json', (config) => {
    config.expo.name = newName
    config.expo.slug = newSlug
    config.expo.scheme = newSlug.replace(/[^a-zA-Z0-9]/g, '')
    if (config.expo.ios) config.expo.ios.bundleIdentifier = newBundleId
    if (config.expo.android) config.expo.android.package = newBundleId
  })

  // 1.5 Update native folders
  const newScheme = newSlug.replace(/[^a-zA-Z0-9]/g, '')
  renameNativeFoldersAndFiles(newBundleId, newScheme, newName)

  // 2. Update package.json
  updateJSON('package.json', (config) => {
    config.name = newSlug
    delete config.author
  })

  // 2.5 Remove cache, build, & lock files
  const pathsToRemove = [
    'package-lock.json',
    'android/.cxx',
    'android/app/build',
    'android/build',
    'ios/Pods',
    'ios/Podfile.lock',
  ]

  console.log('\nCleaning build and lock files...')
  for (const p of pathsToRemove) {
    const fullP = path.join(rootDir, p)
    if (fs.existsSync(fullP)) {
      fs.rmSync(fullP, { recursive: true, force: true })
      console.log(`Removed ${p}`)
    }
  }

  console.log('\nRunning npm install...')
  try {
    require('child_process').execSync('npm install', { cwd: rootDir, stdio: 'inherit' })
  } catch (error) {
    console.error('npm install failed. You may need to run it manually.', error)
  }

  // 3. Update app/(tabs)/index.tsx (Title or Replace)
  if (isCleanUI) {
    const templatePath = path.join(rootDir, 'scripts/templates/index.tsx.template')
    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, path.join(rootDir, 'app/(tabs)/index.tsx'))
      console.log('Updated app/(tabs)/index.tsx with generic template')
    }
    // Also remove secondary tab if it exists
    const tabTwoPath = path.join(rootDir, 'app/(tabs)/two.tsx')
    if (fs.existsSync(tabTwoPath)) {
      fs.unlinkSync(tabTwoPath)
      console.log('Removed app/(tabs)/two.tsx')
    }
  } else {
    replaceInFile(
      'app/(tabs)/index.tsx',
      /<Text style={styles\.title}>.*?<\/Text>/,
      `<Text style={styles.title}>${newName}</Text>`,
    )
  }

  // 4. Handle README Transformation
  if (isTransform) {
    const templatePath = path.join(rootDir, 'scripts/templates/README.md.template')
    if (fs.existsSync(templatePath)) {
      let genericReadme = fs.readFileSync(templatePath, 'utf8')
      genericReadme = genericReadme.replace(/APP_NAME/g, newName)
      fs.writeFileSync(path.join(rootDir, 'README.md'), genericReadme)
      console.log('Updated README.md with generic project template')
    }
  } else {
    replaceInFile('README.md', /^# 🍐 .*$/m, `# 🍐 ${newName}`)
  }

  console.log('\n✅ Project successfully customized!')
  console.log(`Name: ${newName}`)
  console.log(`Slug: ${newSlug}`)
  console.log(`Bundle ID: ${newBundleId}`)

  const shouldCleanup = await question('\nCleanup: Delete initialization scripts? (y/n): ')
  if (shouldCleanup.toLowerCase() === 'y') {
    const scriptsDir = path.join(rootDir, 'scripts')
    try {
      fs.rmSync(scriptsDir, { recursive: true, force: true })
      console.log('Initialization scripts removed.')
    } catch (_) {
      console.error('Failed to remove scripts directory. You may delete it manually.')
    }
  }

  rl.close()
}

run().catch(console.error)
