#!/usr/bin/env node

/**
 * Скрипт для проверки здоровья проекта GrowTasks
 * Запуск: node check-health.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка здоровья проекта GrowTasks...\n');

// Проверка основных файлов
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'src/main.tsx',
  'src/App.tsx',
  'src/index.css',
  'index.html'
];

console.log('📁 Проверка основных файлов:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - НЕ НАЙДЕН`);
  }
});

// Проверка папок
const requiredDirs = [
  'src',
  'src/components',
  'src/components/ui',
  'src/pages',
  'src/hooks',
  'src/lib'
];

console.log('\n📁 Проверка структуры папок:');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`  ✅ ${dir}/`);
  } else {
    console.log(`  ❌ ${dir}/ - НЕ НАЙДЕНА`);
  }
});

// Проверка package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('\n📦 Проверка package.json:');
  console.log(`  ✅ Версия: ${packageJson.version}`);
  console.log(`  ✅ Имя: ${packageJson.name}`);
  
  if (packageJson.scripts) {
    console.log('  ✅ Скрипты:');
    Object.keys(packageJson.scripts).forEach(script => {
      console.log(`    - ${script}: ${packageJson.scripts[script]}`);
    });
  }
  
  if (packageJson.dependencies) {
    console.log(`  ✅ Зависимости: ${Object.keys(packageJson.dependencies).length}`);
  }
  
  if (packageJson.devDependencies) {
    console.log(`  ✅ Dev зависимости: ${Object.keys(packageJson.devDependencies).length}`);
  }
} catch (error) {
  console.log(`  ❌ Ошибка чтения package.json: ${error.message}`);
}

// Проверка node_modules
console.log('\n📦 Проверка зависимостей:');
if (fs.existsSync('node_modules')) {
  console.log('  ✅ node_modules/ существует');
  
  // Проверка ключевых пакетов
  const keyPackages = ['react', 'vite', 'typescript'];
  keyPackages.forEach(pkg => {
    const pkgPath = path.join('node_modules', pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`    ✅ ${pkg} установлен`);
    } else {
      console.log(`    ❌ ${pkg} НЕ установлен`);
    }
  });
} else {
  console.log('  ❌ node_modules/ НЕ НАЙДЕНА - выполните yarn install');
}

// Проверка lock файлов
console.log('\n🔒 Проверка lock файлов:');
const lockFiles = ['yarn.lock', 'package-lock.json', 'bun.lockb'];
lockFiles.forEach(lockFile => {
  if (fs.existsSync(lockFile)) {
    console.log(`  ✅ ${lockFile}`);
  }
});

// Рекомендации
console.log('\n💡 Рекомендации:');
console.log('  1. Убедитесь, что у вас установлен Node.js 18+');
console.log('  2. Выполните: yarn install');
console.log('  3. Запустите: yarn dev');
console.log('  4. Откройте: http://localhost:8080');

console.log('\n🎯 Проверка завершена!');
