const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

// Load and parse .gitignore
function loadGitignore(dirPath) {
    const gitignorePath = path.join(dirPath, '.gitignore');
    const ig = ignore();
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        ig.add(gitignoreContent);
    }
    return ig;
}

function printTree(dirPath, ig, basePath = dirPath, prefix = '') {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    // Sort to list directories before files (optional)
    items.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
    });

    const filteredItems = items.filter(item => {
        const relativePath = path.relative(basePath, path.join(dirPath, item.name));
        return !ig.ignores(relativePath);
    });

    filteredItems.forEach((item, index) => {
        const isLast = index === filteredItems.length - 1;
        const symbol = isLast ? '└──' : '├──';
        const fullPath = path.join(dirPath, item.name);

        if (item.isDirectory()) {
            console.log(`${prefix}${symbol} 📁 ${item.name}`);
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            printTree(fullPath, ig, basePath, newPrefix);
        } else {
            console.log(`${prefix}${symbol} ${item.name}`);
        }
    });
}

// CLI input: node tree.js ./your-folder
const inputPath = process.argv[2] || '.';
const resolvedPath = path.resolve(inputPath);

console.log(`📁 ${resolvedPath}`);
const ig = loadGitignore(resolvedPath);
printTree(resolvedPath, ig);
