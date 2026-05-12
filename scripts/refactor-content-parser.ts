import * as fs from 'fs';
import * as path from 'path';

const moduleDir = path.join(process.cwd(), 'src', 'content-parser');

function readFile(name: string) {
  try {
    return fs.readFileSync(path.join(moduleDir, name), 'utf-8');
  } catch (e) {
    return '';
  }
}

function stripInternalImports(content: string, internalModules: string[]) {
  const lines = content.split('\n');
  return lines.filter(line => {
    if (line.startsWith('import ') || line.startsWith('export {')) {
      const isInternal = internalModules.some(mod => line.includes(`"./${mod}"`) || line.includes(`'./${mod}'`));
      if (isInternal) return false;
    }
    return true;
  }).join('\n');
}

function run() {
  // 1. Merge schema.ts, types.ts, validator.ts into core.ts
  const typesContent = readFile('types.ts');
  const schemaContent = readFile('schema.ts');
  const validatorContent = readFile('validator.ts');
  
  let coreContent = `// === Types ===\n${typesContent}\n\n// === Schema ===\n${schemaContent}\n\n// === Validator ===\n${validatorContent}`;
  coreContent = stripInternalImports(coreContent, ['types', 'schema', 'validator']);
  
  fs.writeFileSync(path.join(moduleDir, 'core.ts'), coreContent);

  // 2. Merge extractor.ts, prompt.ts, runner.ts, render.ts into service.ts
  const extractorContent = readFile('extractor.ts');
  const promptContent = readFile('prompt.ts');
  const runnerContent = readFile('runner.ts');
  const renderContent = readFile('render.ts');
  
  let serviceContent = `// === Extractor ===\n${extractorContent}\n\n// === Prompt ===\n${promptContent}\n\n// === Runner ===\n${runnerContent}\n\n// === Render ===\n${renderContent}`;
  serviceContent = stripInternalImports(serviceContent, ['extractor', 'prompt', 'runner', 'render']);
  
  // Replace imports of types/schema/validator with core
  serviceContent = serviceContent.replace(/from "\.\/(types|schema|validator)"/g, 'from "./core"');
  
  fs.writeFileSync(path.join(moduleDir, 'service.ts'), serviceContent);

  // 3. Fix cli.ts and index.ts
  let cliContent = readFile('cli.ts');
  cliContent = cliContent.replace(/from "\.\/(types|schema|validator)"/g, 'from "./core"');
  cliContent = cliContent.replace(/from "\.\/(extractor|prompt|runner|render)"/g, 'from "./service"');
  fs.writeFileSync(path.join(moduleDir, 'cli.ts'), cliContent);

  let indexContent = readFile('index.ts');
  indexContent = indexContent.replace(/from "\.\/(types|schema|validator)"/g, 'from "./core"');
  indexContent = indexContent.replace(/from "\.\/(extractor|prompt|runner|render)"/g, 'from "./service"');
  fs.writeFileSync(path.join(moduleDir, 'index.ts'), indexContent);

  // 4. Delete old files
  ['types.ts', 'schema.ts', 'validator.ts', 'extractor.ts', 'prompt.ts', 'runner.ts', 'render.ts'].forEach(f => {
    fs.unlinkSync(path.join(moduleDir, f));
  });
  console.log('content-parser consolidated successfully.');
}

run();
