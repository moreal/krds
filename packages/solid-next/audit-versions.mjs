import{createRequire}from'node:module';import{readFileSync,existsSync}from'node:fs';import{dirname,join}from'node:path';
const require=createRequire(import.meta.url);
function manifest(entry){for(let path=dirname(entry);path!==dirname(path);path=dirname(path)){const file=join(path,'package.json');if(existsSync(file)){const data=JSON.parse(readFileSync(file));if(data.name)return{path:file,...data};}}throw Error(entry);}
const results=[];for(const name of ['solid-js','@solidjs/web','@solidjs/compiler','@solidjs/babel-plugin','@solidjs/vite-plugin']){const entry=require.resolve(name),pkg=manifest(entry),local=createRequire(entry);const nested=[];for(const [dependency,range]of Object.entries({...pkg.dependencies,...pkg.optionalDependencies})){if(dependency.startsWith('@solidjs/')||dependency==='solid-js'){try{const target=manifest(local.resolve(dependency));nested.push({name:dependency,range,version:target.version,path:target.path});}catch(error){nested.push({name:dependency,range,error:String(error)});}}}results.push({name,version:pkg.version,path:pkg.path,nested});}if(!process.argv.includes('--check'))console.log(JSON.stringify(results,null,2));
if(process.argv.includes('--check')){
 const expected={'solid-js':'2.0.0-rc.19','@solidjs/web':'2.0.0-rc.19','@solidjs/compiler':'2.0.0-rc.19','@solidjs/babel-plugin':'2.0.0-rc.19','@solidjs/vite-plugin':'3.0.0-next.53','@solidjs/signals':'2.0.0-rc.19'};
 const drift=results.flatMap(item=>[{name:item.name,version:item.version},...item.nested.filter(child=>child.version)]).filter(item=>expected[item.name]&&item.version!==expected[item.name]);
 if(!drift.length)console.log('Solid 2 exact RC.19 direct and transitive version audit passed');
 if(drift.length){console.error('Exact Solid 2 RC set is incoherent:',JSON.stringify(drift));process.exitCode=1;}
}
