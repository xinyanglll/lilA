'use strict';
const $ = selector => document.querySelector(selector);
const STORAGE_KEY = 'lila.notes.v1';
const palette = ['#e7e7d4', '#dce6ee', '#f2e7b7', '#edd6cc', '#dce7d6', '#e8dfed', '#dddde5'];
const views = ['home','mood','note','calendar'];
let entries = [], editing = null, opened = null, noticeTimer;
function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function parseDay(value) { const [y,m,d] = value.split('-').map(Number); return new Date(y,m-1,d,12); }
function validDay(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && localDate(parseDay(value)) === value; }
let selectedDay = localDate(), month = new Date(new Date().getFullYear(), new Date().getMonth(),1);
function notify(message) { clearTimeout(noticeTimer); $('#notice').textContent=message; noticeTimer=setTimeout(()=>$('#notice').textContent='',6500); }
try {
  const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
  if (!Array.isArray(saved)) throw new Error('Invalid notes');
  entries=saved.filter(e=>e && typeof e.id==='string' && validDay(e.date) && Number.isInteger(e.mood) && e.mood>=0 && e.mood<states.length && typeof e.text==='string' && typeof e.createdAt==='string');
  entries = entries.map(entry => entry.mood === 4 ? {...entry, mood:0} : entry);
} catch { notify('Saved notes could not be read. Existing browser data has not been overwritten.'); }
let loadFailed=false;
try { const raw=localStorage.getItem(STORAGE_KEY); if(raw && !Array.isArray(JSON.parse(raw))) loadFailed=true; } catch { loadFailed=true; }
function persist(next) {
  if(loadFailed){notify('Browser storage is unavailable or contains unreadable data. Export any visible notes before continuing.');return false;}
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(next)); entries=next; return true; }
  catch { notify('Could not save. Your note is still here. Keep this page open and copy your text.'); return false; }
}
function go(view) { if(location.hash===`#${view}`) renderRoute(); else { location.hash=view; renderRoute(); } }
function renderRoute() {
  const view=location.hash.slice(1); const current=views.includes(view)?view:'home';
  stopMusic(); stopSound();
  views.forEach(v=>{$(`#${v}-view`).hidden=v!==current;});
  document.querySelectorAll('nav a').forEach(a=>{if(a.hash===`#${current}`)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  if(current==='home')renderWeek();
  if(current==='calendar')renderCalendar();
  if(current==='note')syncNoteMood();
  const heading=$(`#${current}-view h1`);heading.focus({preventScroll:true});window.scrollTo(0,0);
}
function startNote(date=localDate()) {
  editing=null;index=0;render();$('#note-date').value=date;$('#note-text').value='';$('#char-count').textContent='0 / 2000';syncNoteMood();go('mood');
}
function syncNoteMood() { syncEnglishDate(); $('#note-mood').textContent=`Feeling ${states[index].name.toLowerCase()}`;$('.note-editor').style.setProperty('--note',palette[index]); }
$('#start').addEventListener('click',()=>startNote());
$('#calendar-new').addEventListener('click',()=>startNote());
$('#add-day').addEventListener('click',()=>startNote(selectedDay));
$('#mood-back').addEventListener('click',()=>go(editing?'calendar':'home'));
$('#to-note').addEventListener('click',()=>{syncNoteMood();go('note');});
$('#note-back').addEventListener('click',()=>go('mood'));
$('#cancel-note').addEventListener('click',()=>go('calendar'));
$('#note-text').addEventListener('input',()=>$('#char-count').textContent=`${$('#note-text').value.length} / 2000`);
$('#note-form').addEventListener('submit',event=>{
  event.preventDefault(); const date=$('#note-date').value;
  if(!validDay(date)){notify('Choose a valid date for your note.');return;}
  const previous=entries.find(e=>e.id===editing);
  const id=previous?.id || (crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const entry={id,date,mood:index,text:$('#note-text').value.trim().slice(0,2000),createdAt:previous?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
  const next=editing?entries.map(e=>e.id===editing?entry:e):[...entries,entry];
  if(!persist(next))return;
  selectedDay=date;month=new Date(parseDay(date).getFullYear(),parseDay(date).getMonth(),1);editing=null;
  $('#note-text').value='';go('calendar');notify('Your little thought is pinned.');
});
function dayEntries(date) { return entries.filter(e=>e.date===date).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)); }
function renderWeek() {
  const strip=$('#week-strip');strip.replaceChildren();
  for(let n=6;n>=0;n--){const date=new Date();date.setDate(date.getDate()-n);const key=localDate(date), list=dayEntries(key),b=document.createElement('button');b.className='week-day';b.type='button';
    b.setAttribute('aria-label',`${date.toLocaleDateString('en',{month:'long',day:'numeric'})}, ${list.length} notes`);
    const label=document.createElement('span');label.textContent=date.toLocaleDateString('en',{weekday:'short'});const number=document.createElement('b');number.textContent=date.getDate();b.append(label,number);
    if(list.length){const label=document.createElement('span');label.textContent=states[list[0].mood].name;label.className='week-mood';b.append(label);}else{const dot=document.createElement('div');dot.className='empty-dot';dot.textContent='·';b.append(dot);}
    b.addEventListener('click',()=>{selectedDay=key;month=new Date(date.getFullYear(),date.getMonth(),1);go('calendar');});strip.append(b);
  }
}
function renderCalendar() {
  $('#month-label').textContent=month.toLocaleDateString('en',{month:'long',year:'numeric'});
  const grid=$('#calendar-grid');grid.replaceChildren();const offset=(month.getDay()+6)%7,days=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
  const cells=Math.ceil((offset+days)/7)*7;
  for(let c=0;c<cells;c++){
    const day=c-offset+1;
    if(day<1||day>days){const blank=document.createElement('div');blank.className='calendar-cell empty';blank.setAttribute('aria-hidden','true');grid.append(blank);continue;}
    const date=localDate(new Date(month.getFullYear(),month.getMonth(),day)),list=dayEntries(date),b=document.createElement('button');b.type='button';b.className='calendar-cell'+(date===localDate()?' today':'')+(date===selectedDay?' selected':'');b.setAttribute('aria-label',`${parseDay(date).toLocaleDateString('en',{month:'long',day:'numeric',year:'numeric'})}, ${list.length} ${list.length===1?'note':'notes'}`);b.setAttribute('aria-pressed',String(date===selectedDay));
    const num=document.createElement('span');num.className='day-number';num.textContent=day;b.append(num);
    if(list.length){const stamp=document.createElement('img');stamp.className='calendar-stamp';stamp.src=`assets/stamp-${states[list[0].mood].name.toLowerCase()}.svg?v=handdrawn`;stamp.alt=`${states[list[0].mood].name} apple`;stamp.width=64;stamp.height=64;b.append(stamp);}
    b.addEventListener('click',()=>{selectedDay=date;renderCalendar();});grid.append(b);
  }
  renderDay();
}
function renderDay() {
  $('#day-label').textContent=parseDay(selectedDay).toLocaleDateString('en',{weekday:'long',month:'short',day:'numeric'});
  const panel=$('#day-notes');panel.replaceChildren();const list=dayEntries(selectedDay);
  if(!list.length){const empty=document.createElement('p');empty.className='empty-message';empty.textContent='A blank little page. What would you like to remember?';panel.append(empty);}
  list.forEach(e=>{const card=document.createElement('button');card.type='button';card.className='note-card';const paperSeed=[...e.id].reduce((sum,c)=>sum+c.charCodeAt(0),0);card.dataset.paper=String(paperSeed%5);card.style.setProperty('--paper-tilt',`${((paperSeed%37)-18)/10}deg`);card.style.setProperty('--note',palette[e.mood]);const meta=document.createElement('span');meta.className='card-meta';meta.textContent=`${states[e.mood].name.toUpperCase()} · ${new Date(e.createdAt).toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'})}`;const text=document.createElement('p');text.textContent=e.text.length>160?e.text.slice(0,160)+'…':e.text||'Just checking in. No words needed.';card.append(meta,text);card.addEventListener('click',()=>openEntry(e.id));panel.append(card);});
}
function openEntry(id) {
  const e=entries.find(e=>e.id===id);if(!e)return;opened=id;
  $('#entry-dialog').style.background=palette[e.mood];$('#entry-date').textContent=parseDay(e.date).toLocaleDateString('en',{month:'long',day:'numeric',year:'numeric'});$('#entry-title').textContent=`A ${states[e.mood].name.toLowerCase()} little moment`;
  $('#entry-text').textContent=e.text||'Just checking in. No words needed.';$('#delete-confirm').hidden=true;$('.dialog-actions').hidden=false;$('#entry-dialog').showModal();
}
$('#close-entry').addEventListener('click',()=>$('#entry-dialog').close());
$('#edit-entry').addEventListener('click',()=>{const e=entries.find(e=>e.id===opened);if(!e)return;editing=e.id;index=e.mood;render();$('#note-date').value=e.date;$('#note-text').value=e.text;$('#char-count').textContent=`${e.text.length} / 2000`;$('#entry-dialog').close();go('note');});
$('#delete-entry').addEventListener('click',()=>{$('#delete-confirm').hidden=false;$('.dialog-actions').hidden=true;});
$('#keep-entry').addEventListener('click',()=>{$('#delete-confirm').hidden=true;$('.dialog-actions').hidden=false;});
$('#confirm-delete').addEventListener('click',()=>{if(persist(entries.filter(e=>e.id!==opened))){$('#entry-dialog').close();renderCalendar();notify('Note deleted.');}});
function changeMonth(amount) {month=new Date(month.getFullYear(),month.getMonth()+amount,1);selectedDay=localDate(month);renderCalendar();}
$('#prev-month').addEventListener('click',()=>changeMonth(-1));$('#next-month').addEventListener('click',()=>changeMonth(1));
$('#today').addEventListener('click',()=>{selectedDay=localDate();month=new Date(new Date().getFullYear(),new Date().getMonth(),1);renderCalendar();});
$('#export').addEventListener('click',()=>{if(!entries.length){notify('No notes to export yet. Leave your first little thought.');return;}const url=URL.createObjectURL(new Blob([JSON.stringify({app:'lilA',version:1,exportedAt:new Date().toISOString(),notes:entries},null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=`lilA-notes-${localDate()}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Your notes have been exported as a JSON backup.');});
window.addEventListener('hashchange',renderRoute);
// Explicit English date parts avoid OS-localized date input text on mobile.
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
monthNames.forEach((name,i)=>$('#date-month').add(new Option(name,String(i+1))));
const thisYear = new Date().getFullYear();
for(let year=thisYear-100;year<=thisYear+10;year++) $('#date-year').add(new Option(String(year),String(year)));
function fillDateDays(year,month,day) {
  const last = new Date(year,month,0).getDate();
  $('#date-day').replaceChildren();
  for(let n=1;n<=last;n++) $('#date-day').add(new Option(String(n),String(n)));
  $('#date-day').value=String(Math.min(day,last));
}
function syncEnglishDate() {
  const value=$('#note-date').value || localDate();
  const [year,month,day]=value.split('-').map(Number);
  if(![...$('#date-year').options].some(o=>Number(o.value)===year)) $('#date-year').add(new Option(String(year),String(year)));
  $('#date-month').value=String(month);$('#date-year').value=String(year);fillDateDays(year,month,day);
}
function updateEnglishDate() {
  const year=Number($('#date-year').value),month=Number($('#date-month').value),day=Number($('#date-day').value)||1;
  fillDateDays(year,month,day);
  $('#note-date').value=`${year}-${String(month).padStart(2,'0')}-${String($('#date-day').value).padStart(2,'0')}`;
}
['#date-month','#date-day','#date-year'].forEach(id=>$(id).addEventListener('change',updateEnglishDate));
$('#note-date').value=localDate();syncEnglishDate();renderWeek();renderRoute();
