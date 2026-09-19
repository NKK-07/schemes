const fs=require('fs'); const semver=require(process.argv[2]+'/node_modules/semver');
const txt=fs.readFileSync('docs/evidence/phase-00/01-npm-view.txt','utf8');
const blocks=txt.split(/^===== /m).filter(Boolean);
const locked={}; const info={};
for(const b of blocks){const head=b.split('\n')[0]; const m=head.match(/^(.+)@([0-9.]+) /); locked[m[1]]=m[2];
 const json=b.slice(b.indexOf('\n')+1, b.lastIndexOf('exit=')); info[m[1]]=JSON.parse(json);}
locked['node']='22.22.2';
let issues=0;
for(const [pkg,i] of Object.entries(info)){
  const eng=i.engines&&i.engines.node; if(eng && !semver.satisfies('22.22.2',eng)){console.log(`ENGINE ${pkg}: node ${eng} not satisfied by 22.22.2`);issues++;}
  for(const [peer,range] of Object.entries(i.peerDependencies||{})){
    if(locked[peer]){ const ok=semver.satisfies(locked[peer],range,{includePrerelease:true}); console.log(`${ok?'ok  ':'FAIL'} ${pkg} peer ${peer}@${range} vs locked ${locked[peer]}`); if(!ok)issues++; }
    else console.log(`n/a  ${pkg} peer ${peer}@${range} (not in the locked set)`);
  }
}
console.log('issues:',issues);
