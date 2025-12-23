#!/usr/bin/env node

// Dependency Therapist - Because your packages need couples counseling
// Warning: This won't fix your marriage, but might fix your node_modules

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🛋️  Welcome to Dependency Therapy!\n');
console.log('Let\'s unpack your emotional baggage...\n');

// Check if package.json exists (spoiler: it probably doesn't work)
if (!fs.existsSync('package.json')) {
    console.log('❌ No package.json found. Are you sure this is a project?');
    console.log('   Try: npm init -y (and then regret your life choices)');
    process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// The "How are you feeling today?" of dependency analysis
console.log(`Project: ${pkg.name || 'Unnamed Regret'}`);
console.log(`Version: ${pkg.version || '0.0.1-alpha-broken'}`);
console.log(`Dependencies: ${Object.keys(pkg.dependencies || {}).length}`);
console.log(`Dev Dependencies: ${Object.keys(pkg.devDependencies || {}).length}`);
console.log('');

// Check for obvious red flags
const redFlags = [];

if (pkg.dependencies) {
    Object.entries(pkg.dependencies).forEach(([dep, version]) => {
        if (version === 'latest' || version === '*') {
            redFlags.push(`${dep}: Using "${version}" - Living on the edge, I see?`);
        }
        if (dep.includes('beta') || dep.includes('alpha') || dep.includes('rc')) {
            redFlags.push(`${dep}: Pre-release version detected - You brave soul`);
        }
    });
}

// Check for circular dependencies (simplified check)
if (pkg.dependencies && pkg.name) {
    if (pkg.dependencies[pkg.name]) {
        redFlags.push(`Self-dependency detected: ${pkg.name} depends on itself. Inception much?`);
    }
}

// Check node_modules size (because why not)
try {
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
        const stats = fs.statSync(nodeModulesPath);
        const sizeMB = Math.round(stats.size / (1024 * 1024));
        if (sizeMB > 100) {
            redFlags.push(`node_modules: ${sizeMB}MB - That's a whole lot of baggage`);
        }
    }
} catch (error) {
    // node_modules is probably corrupted anyway
}

// Deliver the diagnosis
if (redFlags.length > 0) {
    console.log('🚨 THERAPIST NOTES (You might want to sit down):');
    redFlags.forEach(flag => console.log(`  • ${flag}`));
    console.log('');
    console.log('💡 PRESCRIPTION:');
    console.log('  1. Take a deep breath');
    console.log('  2. Delete node_modules and package-lock.json');
    console.log('  3. Run: npm install (and pray)');
    console.log('  4. If that fails: npm cache clean --force');
    console.log('  5. Consider a career in gardening');
} else {
    console.log('✅ Your dependencies look surprisingly healthy!');
    console.log('   (This is probably wrong, but enjoy the moment)');
}

console.log('\n💭 Remember: The real dependency was the friends we made along the way.\n');
