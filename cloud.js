 'use strict';
(function(){
const $=id=>document.getElementById(id);
const roleKey='glosmastaren-role-v2';
const adminSession='glosmastaren-admin-unlocked';
const pin='6666'; // Enkel menyspärr, inte säker autentisering.
const githubEdit='https://github.com/Lklf12/glosmastaren/edit/main/glosor.json';
const url='./glosor.json';
const status=s=>{$('cloudStatus').textContent=s};
const role=()=>sessionStorage.getItem(adminSession)==='yes'?'admin':'child';
function setRole(r){
  if(r==='admin'&&sessionStorage.getItem(adminSession)!=='yes'){
    const entry=prompt('Ange PIN-kod för adminläge:');
    if(entry!==pin){alert('Fel PIN-kod eller avbrutet.');r='child'}
    else sessionStorage.setItem(adminSession,'yes');
  }
  if(r!=='admin')sessionStorage.removeItem(adminSession);
  localStorage.setItem(roleKey,r);
  $('roleSelect').value=r;
  const admin=r==='admin';
  document.querySelector('[data-tab="lists"]').classList.toggle('hidden',!admin);
  if(!admin&&!$('lists').classList.contains('hidden'))document.querySelector('[data-tab="practice"]').click();
  status(admin?'Adminläge: redigera lokalt och välj Publicera när listan är klar.':'Träningsläge: hämta publicerade glosor från GitHub.');
}
async function refresh(){
 status('Hämtar gloslistor från GitHub…');
 try{
  const response=await fetch(url+'?v='+Date.now(),{cache:'no-store'});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const data=await response.json();
  if(!data||!Array.isArray(data.lists)||!data.lists.length)throw new Error('Ogiltigt filformat');
  const clean=data.lists.map((l,i)=>({id:String(l.id||'remote-'+i),name:String(l.name||'Gloslista'),words:Array.isArray(l.words)?l.words.filter(w=>Array.isArray(w)&&w.length===2&&w.every(v=>typeof v==='string'&&v.trim())).map(w=>[w[0],w[1]]):[]}));
  if(!clean.some(l=>l.words.length))throw new Error('Inga giltiga glosor');
  if(role()==='admin'&&!confirm('Hämta publicerade listor? Lokala ändringar som inte publicerats ersätts.')){status('Hämtning avbruten.');return}
  state.lists=clean;selected=clean[0].id;save();options();status('✓ '+clean.length+' gloslistor hämtade från GitHub.');
 }catch(e){status('Kunde inte hämta nya glosor ('+e.message+'). Sparade listor fungerar fortfarande.')}
}
function payload(){return JSON.stringify({version:1,updated:new Date().toISOString(),lists:state.lists.map(l=>({id:l.id,name:l.name,words:l.words}))},null,2)}
async function copyText(s){
 try{await navigator.clipboard.writeText(s);return true}catch(e){return false}
}
$('roleSelect').addEventListener('change',e=>setRole(e.target.value));
$('refreshCloud').addEventListener('click',refresh);
$('publishCloud').addEventListener('click',async()=>{
 if(!state.lists.some(l=>l.words.length))return alert('Lägg till glosor först.');
 const content=payload();$('publishText').value=content;$('publishFallback').classList.remove('hidden');
 // Öppna direkt under klickhändelsen så iOS Safari inte blockerar den som popup.
 const opened=window.open(githubEdit,'_blank');
 const copied=await copyText(content);
 $('publishStatus').textContent=(copied?'✓ Glosorna är kopierade. ':'Kopiering blockerades. Markera texten nedan och kopiera. ')+(opened?'På GitHub: markera allt i redigeringsrutan, klistra in och välj Commit changes.':'Öppna GitHub via länken nedan och klistra in.');
 if(!opened){let a=$('githubManual');if(!a){a=document.createElement('a');a.id='githubManual';a.href=githubEdit;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Öppna GitHubs redigeringssida ↗';$('publishStatus').after(a)}}
});
$('copyAgain').addEventListener('click',async()=>{const ok=await copyText($('publishText').value);if(!ok){$('publishText').focus();$('publishText').select();alert('Markera och kopiera texten manuellt.')}else $('publishStatus').textContent='✓ Kopierat! Gå till GitHub och klistra in.'});
setRole('child');
refresh();
})();
