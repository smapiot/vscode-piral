const path = require('path');
const fs = require('fs');
const process = require('process');

const args = require('minimist')(process.argv.slice(2));

if(args.target != undefined) {
    targetPath = args.target;
} else {
    console.log('Target argument must be provided! Example: node updatePackageJson.js --target /dev/temp/piral-app');
    process.exit(0);
}

var filePath = path.resolve(targetPath, 'package.json');
  
if(!fs.existsSync(filePath)) {
    return RepoType.Undefined;
}

let packageFile = fs.readFileSync(filePath, "utf8");
let packageJson = JSON.parse(packageFile);

if(args.version != undefined) 
    packageJson.version = args.version;

if(args.description != undefined) 
    packageJson.description = args.description;

if(args.piralPackage != undefined) {
    let piralPackage = args.piralPackage.split('@');
    var piralPackageName = '';
    var piralPackageVersion = 'latest';

    // piral
    if(piralPackage.length == 1) {
        piralPackageName = piralPackageName.length == 0 ? 'piral' : piralPackage[0];
    }

    // piral@1.1.0
    if(piralPackage.length == 2) {
        if(piralPackage[0].length == 0) {
            piralPackageName = '@' + piralPackage[1];
        } else {
            piralPackageName = piralPackage[0];
            piralPackageVersion = piralPackage[1];
        }
    }
    
    // @smapiot/piral@1.1.0
    if(piralPackage.length == 3) {
        piralPackageName = '@' + piralPackage[1];
        piralPackageVersion = piralPackage[2];
    }

    // Update peer dependency
    delete packageJson.peerDependencies['piral'];
    packageJson.peerDependencies[piralPackageName] = '*';
    
    // Update dev dependency
    delete packageJson.devDependencies['piral'];
    packageJson.devDependencies[piralPackageName] = piralPackageVersion;

    // Update piral reference
    packageJson.piral.name = piralPackageName
}

if(args.bundler != undefined) {
    delete packageJson.devDependencies['piral-cli-parcel'];
    delete packageJson.devDependencies['piral-cli-webpack'];

    if(args.bundler == 'parcel') 
        packageJson.devDependencies['piral-cli-parcel'] = 'latest';

    if(args.bundler == 'webpack') 
        packageJson.devDependencies['piral-cli-webpack'] = 'latest';
}

fs.writeFileSync(filePath, JSON.stringify(packageJson));

console.log('Updated package.json');

if(args.npmRegistry != undefined) {
    filePath = path.resolve(targetPath, '.npmrc');
    fs.writeFileSync(filePath, `registry=${args.npmRegistry}`);
    console.log('.npmrc created.')
}