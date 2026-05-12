import * as fs from 'fs';
import * as path from 'path';

const srcDir = path.join(process.cwd(), 'src');

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (fullPath.endsWith('.ts')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function mergeSchemaIntoTypes(moduleName: string) {
  const moduleDir = path.join(srcDir, moduleName);
  const typesPath = path.join(moduleDir, 'types.ts');
  const schemaPath = path.join(moduleDir, 'schema.ts');

  if (!fs.existsSync(typesPath) || !fs.existsSync(schemaPath)) return;

  let typesContent = fs.readFileSync(typesPath, 'utf-8');
  let schemaContent = fs.readFileSync(schemaPath, 'utf-8');

  // Remove internal import from schema
  schemaContent = schemaContent.replace(/import\s+{.*}\s+from\s+['"]\.\/types['"];?\n?/g, '');

  // Append schema to types
  typesContent = typesContent + '\n// --- Merged from schema.ts ---\n' + schemaContent;
  fs.writeFileSync(typesPath, typesContent);

  // Delete schema
  fs.unlinkSync(schemaPath);
  console.log(`Merged schema into types for ${moduleName}`);
}

function updateImportsAcrossProject() {
  const allFiles = getAllFiles(srcDir);

  allFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // Fix imports replacing /schema" or /schema' with /types
    if (content.match(/['"](\.\/|\.\.\/.*?\/)schema['"]/g)) {
      content = content.replace(/from\s+['"](\.\/|\.\.\/.*?\/)schema['"]/g, 'from "$1types"');
      changed = true;
    }

    // Now consolidate duplicate imports from types if any exist
    // Actually, letting ESLint fix it or just ignoring duplicate imports from the same file is okay
    // But we can do a naive replace:
    // This is a simple script, we just leave multiple imports from "./types", TS compiler allows it.
    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated imports in ${path.relative(srcDir, filePath)}`);
    }
  });
}

function run() {
  const modules = ['content-parser', 'dictionary-pro', 'toefl-writing', 'style-engine'];
  modules.forEach(mergeSchemaIntoTypes);
  updateImportsAcrossProject();
}

run();
