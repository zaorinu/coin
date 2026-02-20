const fs = require('fs');
const path = require('path');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const workspace = path.join(__dirname, '..');
const schemasDir = path.join(workspace, 'schemas');
const modulesDir = path.join(workspace, 'modules');
const serverFile = path.join(workspace, 'server.js');
const outFile = path.join(workspace, 'docs', 'openapi.yaml');

// load package info
const pkg = readJSON(path.join(workspace, 'package.json'));

// load schemas
const schemas = {};
if (fs.existsSync(schemasDir)) {
  for (const f of fs.readdirSync(schemasDir)) {
    if (f.endsWith('.json')) {
      const name = path.basename(f, '.json');
      schemas[name] = readJSON(path.join(schemasDir, f));
    }
  }
}

// parse server mounts (app.use('/users', require('./modules/users')))
const serverSrc = fs.readFileSync(serverFile, 'utf8');
const mountRegex = /app\.use\(['\"](.*?)['\"],\s*require\(['\"]\.?\/?(modules\/[^'\"]+)['\"]\)\)/g;
const mounts = {};
let m;
while ((m = mountRegex.exec(serverSrc))) {
  const mountPath = m[1];
  const moduleRel = m[2];
  const moduleName = path.basename(moduleRel);
  mounts[moduleName] = mountPath;
}

// for each module, parse its index.js to find routes
const paths = {};
for (const moduleName of Object.keys(mounts)) {
  const idxFile = path.join(workspace, 'modules', moduleName, 'index.js');
  if (!fs.existsSync(idxFile)) continue;
  const src = fs.readFileSync(idxFile, 'utf8');
  const routeRegex = /router\.(get|post|put|delete)\(['\"]([^'\"]+)['\"],\s*require\(['\"](.*?)['\"]\)\)/g;
  let r;
  while ((r = routeRegex.exec(src))) {
    const method = r[1];
    const subpath = r[2];
    const handlerPath = r[3];
    const handlerFile = path.basename(handlerPath).replace(/\.(js|ts)$/, '');

    // build full path
    const mountPath = mounts[moduleName] || `/${moduleName}`;
    let fullPath = path.posix.join(mountPath, subpath);
    if (!fullPath.startsWith('/')) fullPath = '/' + fullPath;

    if (!paths[fullPath]) paths[fullPath] = {};

    // try to find matching schema
    let schemaRef = null;
    // prefer schemas named like `${moduleName}.${operation}` or `${moduleName}.${handlerFile}`
    const candidates = [];
    const handlerTokens = handlerFile.split(/[-_.]/).filter(Boolean);
    candidates.push(`${moduleName}.${handlerTokens[0]}`);
    candidates.push(`${moduleName}.${handlerFile}`);
    candidates.push(`${moduleName}.create`);
    candidates.push(`${moduleName}.update`);
    candidates.push(`${moduleName}.transfer`);
    for (const c of candidates) {
      if (schemas[c]) { schemaRef = `#/components/schemas/${c}`; break; }
    }

    // build operation
    const op = {
      summary: `${method.toUpperCase()} ${fullPath}`,
      responses: {
        '200': { description: 'OK' }
      }
    };
    if (schemaRef && (method === 'post' || method === 'put')) {
      op.requestBody = {
        content: {
          'application/json': { schema: { $ref: schemaRef } }
        }
      };
    }

    paths[fullPath][method] = op;
  }
}

// assemble OpenAPI object
const openapi = {
  openapi: '3.0.3',
  info: {
    title: pkg.name || 'API',
    version: pkg.version || '1.0.0',
    description: pkg.description || ''
  },
  servers: [{ url: '/' }],
  paths: paths,
  components: { schemas: {} }
};

for (const [k, v] of Object.entries(schemas)) {
  openapi.components.schemas[k] = v;
}

// write YAML
function toYAML(obj) {
  // use JSON -> YAML via simple replacement since env may not have yaml lib
  const json = JSON.stringify(obj, null, 2);
  try {
    // prefer js-yaml if available
    const yaml = require('js-yaml');
    return yaml.dump(obj, { noRefs: true });
  } catch (err) {
    // fallback: minimal conversion (not perfect)
    return json;
  }
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, toYAML(openapi));
console.log('Wrote', outFile);
