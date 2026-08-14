"use strict";
const officialEvents=window.DEADLINE_DATA;
const academicSubjects=["Biology", "Business Management", "Chemistry", "Chinese A: Language and Literature", "Chinese B - Mandarin", "Economics", "English A: Language and Literature", "English B", "Environmental Systems and Societies (ESS)", "French Ab Initio", "History", "Malay B", "Mandarin ab initio", "Mathematics: Analysis and Approaches", "Mathematics: Applications and Interpretation", "Physics", "Psychology", "Visual Arts"];
const programmeSubjects={DP:academicSubjects,CP:academicSubjects};
const subjectGroups={"Studies in Language and Literature":["Chinese A: Language and Literature","English A: Language and Literature"],"Language Acquisition":["Chinese B - Mandarin","English B","French Ab Initio","Malay B","Mandarin ab initio"],"Individuals and Societies":["Business Management","Economics","History","Psychology"],"Sciences":["Biology","Chemistry","Environmental Systems and Societies (ESS)","Physics"],"Mathematics":["Mathematics: Analysis and Approaches","Mathematics: Applications and Interpretation"],"Arts":["Visual Arts"]};
const cohortOptions={DP:[["YEAR_1","Year 1 (Batch 2027)"],["YEAR_2","Year 2 (Batch 2026)"]],CP:[["YEAR_1","Year 1 (Batch 2027)"],["YEAR_2","Year 2 (Batch 2026)"]]};
const sharedOptions={
  DP:[
    ["Theory of Knowledge","Theory of Knowledge"],
    ["Extended Essay","Extended Essay"],
    ["CAS","CAS"],
    ["Examinations and study periods","Examinations and study periods"]
  ],
  CP:[
    ["Reflective Project","Reflective Project"],
    ["Community Engagement / Service Learning","Community Engagement / Service Learning"],
    ["Personal and Professional Skills","Personal and Professional Skills (PPS)"],
    ["Language Development","Language Development"],
    ["Examinations and study periods","Examinations and study periods"]
  ]
};
const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
let state=JSON.parse(localStorage.getItem("dpPlanner2026State")||'{"programme":"","cohort":"","subjects":[],"shared":[]}');
if(state.cohort==="DP Class of 2027")state.cohort="YEAR_1";
if(state.cohort==="DP Class of 2026")state.cohort="YEAR_2";
let personal=JSON.parse(localStorage.getItem("dpPersonalCards2026")||"[]");
let editingId=null;
const $=id=>document.getElementById(id);
const parse=s=>{const[a,b,c]=s.split("-").map(Number);return new Date(a,b-1,c)};
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
function saveState(){localStorage.setItem("dpPlanner2026State",JSON.stringify(state))}
function savePersonal(){localStorage.setItem("dpPersonalCards2026",JSON.stringify(personal))}
function escapeHtml(value){return String(value??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function cohortLabel(value){return value==="YEAR_1"?"Year 1 (Batch 2027)":value==="YEAR_2"?"Year 2 (Batch 2026)":value}
function updateBuilderVisibility(){const ready=Boolean(state.programme&&state.cohort);$("subjectStep").hidden=!ready;$("builderActions").hidden=!ready}
function updateCohorts(){const select=$("cohortSelect");select.innerHTML='<option value="">Select cohort</option>'+(cohortOptions[state.programme]||[]).map(([value,label])=>`<option value="${value}">${label}</option>`).join("");select.disabled=!state.programme;select.value=(cohortOptions[state.programme]||[]).some(([value])=>value===state.cohort)?state.cohort:"";if(!select.value)state.cohort="";updateBuilderVisibility();renderSubjects();renderShared();saveState()}
function subjectHasDeadlines(subject){return officialEvents.some(event=>!event.coreKey&&event.subject===subject&&mappedCohort(event)===state.cohort)}
function renderSubjects(){
  const q=$("subjectSearch").value.toLowerCase();
  const list=(programmeSubjects[state.programme]||[]).filter(s=>s.toLowerCase().includes(q));
  if(!list.length){$("subjects").innerHTML='<p class="empty-options">No subjects match this search.</p>';return}
  $("subjects").innerHTML=Object.entries(subjectGroups).map(([group,subjects])=>[group,subjects.filter(subject=>list.includes(subject))]).filter(([,subjects])=>subjects.length).map(([group,subjects])=>`<details class="subject-dropdown" open><summary><span>${group}</span><span class="selection-count">${subjects.filter(subject=>state.subjects.includes(subject)).length} selected</span></summary><div class="dropdown-options">${subjects.map(subject=>`<label class="subject-choice"><input type="checkbox" value="${escapeHtml(subject)}" ${state.subjects.includes(subject)?"checked":""}><span><span class="choice-title">${escapeHtml(subject)}</span><span class="choice-detail">${subjectHasDeadlines(subject)?"Official 2026 deadlines available":"No verified 2026 deadlines currently recorded"}</span></span></label>`).join("")}</div></details>`).join("");
  $("subjects").querySelectorAll("input").forEach(i=>i.onchange=()=>{state.subjects=i.checked?[...new Set([...state.subjects,i.value])]:state.subjects.filter(x=>x!==i.value);saveState()});
}
function renderShared(){
  const required=sharedOptions[state.programme]||[];state.shared=required.map(([,key])=>key);$("requiredSummary").innerHTML=required.length?`<strong>Included automatically:</strong> ${required.map(([label])=>escapeHtml(label)).join(", ")}`:"<strong>Included automatically:</strong> No confirmed shared components.";saveState();
}
$("programmeSelect").onchange=()=>{state.programme=$("programmeSelect").value;state.cohort="";state.subjects=[];state.shared=[];updateCohorts()};
$("cohortSelect").onchange=()=>{state.cohort=$("cohortSelect").value;saveState();updateBuilderVisibility();renderSubjects();renderShared()};
$("subjectSearch").oninput=renderSubjects;

function mappedCohort(e){
  if(e.cohort==="Year 2")return"YEAR_2";
  if(e.cohort==="Year 1")return"YEAR_1";
  if(e.cohort==="Year 1–2")return state.cohort;
  if(e.cohort==="DP"||e.cohort==="CP")return state.cohort;
  return e.cohort;
}
function relevantOfficial(){
  return officialEvents.filter(e=>{
    const cohortOk=mappedCohort(e)===state.cohort;
    if(!cohortOk)return false;
    if(e.coreKey==="Examinations and study periods")return state.shared.includes(e.coreKey);
    if(e.coreKey)return e.programme===state.programme&&state.shared.includes(e.coreKey);
    const academicProgrammeApplies=e.programme==="DP"?(state.programme==="DP"||state.programme==="CP"):e.programme===state.programme;
    return academicProgrammeApplies&&state.subjects.includes(e.subject);
  });
}
function classFor(e){if(e.personal)return"personal";if(e.type==="Exam"||e.type==="Study Break")return"exam";if(e.coreKey)return"core";return""}
function displayDate(e){const d=parse(e.start);return`${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`}
function allItems(){
  const official=relevantOfficial().filter(e=>!e.isWindow);
  const personalItems=personal.map(p=>({...p,personal:true,start:p.date,end:null,subject:p.subject||"Personal",description:p.title}));
  return [...official,...personalItems].sort((a,b)=>a.start.localeCompare(b.start));
}
function windowEvents(){return relevantOfficial().filter(e=>e.isWindow)}
function render(){
  const official=relevantOfficial(),items=allItems(),windows=windowEvents();
  $("plannerMeta").textContent=`${state.programme} · ${cohortLabel(state.cohort)} · 2026`;
  const subjectsWithoutDeadlines=state.subjects.filter(subject=>!subjectHasDeadlines(subject));
  $("summary").innerHTML=`<strong>Selected subjects</strong><div class="selected-subject-chips">${state.subjects.length?state.subjects.map(subject=>`<span class="selected-chip">${escapeHtml(subject)}</span>`).join(""):'<span class="meta">No subject-specific options selected</span>'}</div><div class="meta">Included components: ${state.shared.map(escapeHtml).join(", ")||"None"} · ${official.length} official entries · ${personal.length} personal cards</div>${subjectsWithoutDeadlines.length?`<div class="notice"><strong>No verified 2026 deadlines recorded:</strong> ${subjectsWithoutDeadlines.map(escapeHtml).join(", ")}</div>`:""}`;
  const monthSet=new Set();
  official.forEach(e=>monthSet.add(e.start.slice(0,7)));
  personal.forEach(e=>monthSet.add(e.date.slice(0,7)));
  const monthPairs=[...monthSet].sort().map(x=>x.split("-").map(Number));
  $("monthJump").innerHTML='<option value="">Jump to month</option>'+monthPairs.map(([y,m])=>`<option value="m-${y}-${m-1}">${months[m-1]} ${y}</option>`).join("");
  if(!monthPairs.length){$("calendar").innerHTML='<div class="summary">No deadlines match your selections.</div>';$("list").innerHTML="";return}
  $("calendar").innerHTML=monthPairs.map(([y,m1])=>{
    const m=m1-1,first=new Date(y,m,1),off=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate();let cells="";
    for(let i=0;i<off;i++)cells+='<div class="day outside"></div>';
    for(let day=1;day<=days;day++){
      const dt=new Date(y,m,day),ds=iso(dt),weekend=[0,6].includes(dt.getDay());
      const dayItems=items.filter(e=>e.start===ds);
      const bars=windows.filter(w=>parse(w.start)<=dt&&parse(w.end||w.start)>=dt&&!weekend);
      cells+=`<div class="day ${weekend?"weekend":""}"><div class="date">${day}</div><div class="window-bars">${bars.map(()=>'<div class="window-bar"></div>').join("")}</div>${dayItems.map(e=>{
        const bg=e.personal?`style="background:${e.color}"`:"";
        const actions=e.personal?`<div class="card-actions"><button onclick="editCard('${e.id}')">Edit</button><button onclick="deleteCard('${e.id}')">Delete</button></div>`:"";
        return`<div class="event ${classFor(e)}" ${bg}><strong>${e.subject}</strong><div>${e.description}</div>${e.personal&&e.note?`<div class="meta">${e.note}</div>`:""}<div class="meta">${e.personal?'<span class="badge">Personal</span>':mappedCohort(e)}</div>${actions}</div>`;
      }).join("")}</div>`;
    }
    const windowCards=windows.filter(w=>w.start.slice(0,7)===`${y}-${String(m1).padStart(2,"0")}`).map(w=>`<div class="event core"><strong>${w.subject}</strong><div>${w.description}</div><div class="meta">Assessment window: ${displayDate(w)} – ${displayDate({...w,start:w.end})}</div></div>`).join("");
    return`<section id="m-${y}-${m}" class="month"><h2>${months[m]} ${y}</h2>${windowCards}<div class="calendar-wrap"><div class="calendar">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(x=>`<div class="weekday">${x}</div>`).join("")}${cells}</div></div></section>`;
  }).join("");
  $("list").innerHTML='<div class="list-row head"><div>Date</div><div>Category</div><div>Deadline</div></div>'+
    [...official.map(e=>({...e,personal:false})),...personal.map(p=>({...p,personal:true,start:p.date,subject:p.subject||"Personal",description:p.title}))].sort((a,b)=>a.start.localeCompare(b.start)).map(e=>`<div class="list-row"><div>${displayDate(e)}${e.end?` – ${displayDate({...e,start:e.end})}`:""}</div><div>${e.personal?'<span class="badge">Personal</span>':mappedCohort(e)}</div><div><strong>${e.subject}</strong><div class="deadline-description">${e.description}</div></div></div>`).join("");
}
function build(){
  if(!state.programme||!state.cohort){alert("Choose a programme and cohort.");return}
  saveState();$("setup").style.display="none";$("planner").style.display="block";render();window.scrollTo({top:0,behavior:"smooth"});
}
$("buildBtn").onclick=build;
function clearSelections(){state={programme:"",cohort:"",subjects:[],shared:[]};saveState();$("programmeSelect").value="";$("subjectSearch").value="";updateCohorts()}
$("clearBtn").onclick=clearSelections;
$("clearGenerated").onclick=()=>{$("planner").style.display="none";$("setup").style.display="block";clearSelections();window.scrollTo({top:0,behavior:"smooth"})};
$("editSelections").onclick=()=>{$("planner").style.display="none";$("setup").style.display="block";window.scrollTo({top:0,behavior:"smooth"})};

function openModal(card=null){
  editingId=card?.id||null;$("modalTitle").textContent=card?"Edit personal card":"Add personal card";
  $("cardDate").value=card?.date||"";$("cardTitle").value=card?.title||"";$("cardNote").value=card?.note||"";$("cardSubject").value=card?.subject||"";$("cardColor").value=card?.color||"#fff4d6";
  $("cardModal").classList.add("open");
}
function closeModal(){$("cardModal").classList.remove("open");editingId=null}
window.editCard=id=>openModal(personal.find(x=>x.id===id));
window.deleteCard=id=>{if(confirm("Delete this personal card?")){personal=personal.filter(x=>x.id!==id);savePersonal();render()}};
$("addCard").onclick=()=>openModal();$("cancelCard").onclick=closeModal;
$("saveCard").onclick=()=>{
  const date=$("cardDate").value,title=$("cardTitle").value.trim();
  if(!date||!title){alert("Date and title are required.");return}
  const card={id:editingId||crypto.randomUUID(),date,title,note:$("cardNote").value.trim(),subject:$("cardSubject").value.trim(),color:$("cardColor").value};
  personal=editingId?personal.map(x=>x.id===editingId?card:x):[...personal,card];savePersonal();closeModal();render();
};
$("monthJump").onchange=()=>{if($("monthJump").value)$( $("monthJump").value )?.scrollIntoView({behavior:"smooth"})};
$("calTab").onclick=()=>{$("calendar").style.display="block";$("list").style.display="none";$("calTab").classList.add("primary");$("listTab").classList.remove("primary")};
$("listTab").onclick=()=>{$("calendar").style.display="none";$("list").style.display="block";$("listTab").classList.add("primary");$("calTab").classList.remove("primary")};
$("printBtn").onclick=()=>{$("printOptions").style.display=$("printOptions").style.display==="block"?"none":"block"};
$("printAll").onclick=()=>{document.querySelectorAll(".month").forEach(x=>x.classList.remove("print-hidden"));window.print()};
$("printCurrent").onclick=()=>{const target=$("monthJump").value;if(!target){alert("Choose a month first.");return}document.querySelectorAll(".month").forEach(x=>x.classList.toggle("print-hidden",x.id!==target));window.print();setTimeout(()=>document.querySelectorAll(".month").forEach(x=>x.classList.remove("print-hidden")),500)};

$("programmeSelect").value=state.programme;updateCohorts();$("cohortSelect").value=state.cohort;updateBuilderVisibility();renderSubjects();renderShared();
if(state.programme&&state.cohort)build();
