 'use strict';
(function(){
const $=id=>document.getElementById(id);
const roleKey='glosmastaren-role-v2';
const url='./glosor.json';
const status=(s)=>{$('cloudStatus').textContent=s};
const role=()=>localStorage.getItem(roleKey)||'child';
function setRole(r){localStorage.setItem(roleKey,r);$('roleSelect').value=r;const admin=r==='admin';document.querySelector('[data-tab="lists"]').classList.toggle('hidden',!admin);if(!admin && !document.getElementById('lists').classList.contains('hidden'))document.querySelector('[data-tab="practice"]').click();status(admin?'Adminläge: ändringar sparas lokalt tills du publicerar en ny glosor.json.':'Barnläge: tryck på Hämta glosor för att se senaste listorna.');}
async function refresh(){status('Hämtar gloslistor från GitHub…');try{const response=await fetch(url+'?v='+Date.now(),{cache:'no-store'});if(!response.ok)throw new Error('HTTP '+response.status);const data=await response.json();if(!data || !Array.isArray(data.lists) || !data.lists.length)throw new Error('Ogiltigt filformat');const clean=data.lists.map((l,i)=>({id:String(l.id||'remote-'+i),name:String(l.name||'Gloslista'),words:Array.isArray(l.words)?l.words.filter(w=>Array.isArray(w)&&w.length===2&&w.every(v=>typeof v==='string'&&v.trim())).map(w=>[w[0],w[1]]):[]}));if(!clean.some(l=>l.words.length))throw new Error('Inga giltiga glosor');if(role()==='admin' && !confirm('Hämta publicerade listor? Lokala ändringar som inte publicerats ersätts.')){status('Hämtning avbruten.');return;}state.lists=clean;selected=clean[0].id;save();options();status('✓ '+clean.length+' gloslistor hämtade från GitHub.');}catch(e){status('Kunde inte hämta nya glosor ('+e.message+'). Sparade listor fungerar fortfarande.');}}
$('roleSelect').addEventListener('change',e=>setRole(e.target.value));
$('refreshCloud').addEventListener('click',refresh);
$('exportCloud').addEventListener('click',()=>{if(!state.lists.length)return alert('Inga gloslistor finns.');const payload={version:1,updated:new Date().toISOString(),lists:state.lists.map(l=>({id:l.id,name:l.name,words:l.words}))};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');const blobUrl=URL.createObjectURL(blob);a.href=blobUrl;a.download='glosor.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(blobUrl),5000);status('Filen glosor.json är nedladdad. Ladda upp den till GitHub för att publicera.');});
setRole(role());
if(role()==='child')refresh();
})();
