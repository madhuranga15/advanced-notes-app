let notesData = [];

async function loadNotes(){

const res = await fetch("/notes");
notesData = await res.json();

renderNotes(notesData);

}

function renderNotes(notes){

// pinned notes first
const sorted = [...notes].sort((a,b)=> b.pinned - a.pinned);

let html = "";

sorted.forEach((n)=>{

const i = notesData.indexOf(n);

html += `
<div class="note ${n.pinned ? "pinned" : ""}">

<span>${n.text}</span>

<div class="actions">

<div class="icon" onclick="togglePin(${i})">
${n.pinned ? "📌" : "📍"}
</div>

<div class="icon" onclick="editNote(${i})">✏️</div>

<div class="icon" onclick="deleteNote(${i})">🗑</div>

</div>

</div>
`;

});

document.getElementById("notes").innerHTML = html;

}

async function addNote(){

const text = document.getElementById("noteInput").value.trim();
if(!text) return;

await fetch("/notes",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
text:text,
pinned:false
})

});

document.getElementById("noteInput").value="";

loadNotes();

}

async function deleteNote(i){

await fetch("/notes/"+i,{method:"DELETE"});

loadNotes();

}

function editNote(i){

const newText = prompt("Edit note",notesData[i].text);

if(!newText) return;

notesData[i].text = newText;

updateNotes();

}

function togglePin(i){

notesData[i].pinned = !notesData[i].pinned;

updateNotes();

}

function updateNotes(){

fetch("/notes/update",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(notesData)

}).then(()=>{

loadNotes();

});

}

function searchNotes(){

const q = document.getElementById("search").value.toLowerCase();

const filtered = notesData.filter(n =>
n.text.toLowerCase().includes(q)
);

renderNotes(filtered);

}

function toggleMode(){

document.body.classList.toggle("dark");

}

document.getElementById("noteInput")
  .addEventListener("keypress", function(e){
    if(e.key === "Enter") addNote();
  });

loadNotes();
