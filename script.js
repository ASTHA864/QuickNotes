window.onload = loadNotes;
document.getElementById("saveBtn").onclick = saveNote;
document.getElementById("themeToggle").onclick = toggleTheme;

function saveNote() {
  const input = document.getElementById("noteInput");
  const noteText = input.value.trim();
  if (!noteText) {
    gsap.from("#noteInput", { x: -10, duration: 0.2, repeat: 3, yoyo: true });
    return;
  }

  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push(noteText);
  localStorage.setItem("notes", JSON.stringify(notes));
  input.value = "";
  loadNotes();
}

function loadNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";
  const notes = JSON.parse(localStorage.getItem("notes")) || [];

  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    noteDiv.style.perspective = "600px"; // 3D perspective

    // 3D hover effect
    noteDiv.onmousemove = (e) => {
      const rect = noteDiv.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      noteDiv.style.transform = `rotateY(${x / 20}deg) rotateX(${
        -y / 20
      }deg) scale(1.04)`;
    };
    noteDiv.onmouseleave = () => {
      noteDiv.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    };

    const previewText = document.createElement("p");
    previewText.textContent =
      note.length > 60 ? note.slice(0, 60) + "..." : note;

    const viewBtn = document.createElement("button");
    viewBtn.textContent = "View";
    viewBtn.className = "delete-btn";
    viewBtn.style.background = "#5c6bc0";
    viewBtn.onclick = () => viewNote(note);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "delete-btn";
    editBtn.style.background = "#ffb300";
    editBtn.onclick = () => editNote(index, noteDiv, previewText);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteNote(index, noteDiv);

    noteDiv.appendChild(previewText);
    noteDiv.appendChild(viewBtn);
    noteDiv.appendChild(editBtn);
    noteDiv.appendChild(deleteBtn);
    notesContainer.appendChild(noteDiv);

    // GSAP 3D entrance animation
    gsap.from(noteDiv, {
      duration: 0.7,
      y: -40,
      opacity: 0,
      scale: 0.8,
      rotateY: 45,
      ease: "back.out(1.7)",
    });

    if (document.body.classList.contains("dark-mode")) {
      noteDiv.classList.add("dark-mode");
      previewText.classList.add("dark-mode");
      deleteBtn.classList.add("dark-mode");
      editBtn.classList.add("dark-mode");
      viewBtn.classList.add("dark-mode");
    }
  });
}

// 3D button press effect
document.querySelectorAll("button").forEach((btn) => {
  btn.onmousedown = () => {
    btn.style.transform = "scale(0.95) perspective(300px) translateZ(-10px)";
  };
  btn.onmouseup = () => {
    btn.style.transform = "scale(1) perspective(300px) translateZ(0)";
  };
});

function editNote(index, noteDiv, noteTextElement) {
  const currentText = noteTextElement.textContent;
  const editArea = document.createElement("textarea");
  editArea.value = currentText;
  editArea.className = "edit-area";

  const saveEditBtn = document.createElement("button");
  saveEditBtn.textContent = "Save";
  saveEditBtn.className = "delete-btn";
  saveEditBtn.style.background = "#43a047";
  saveEditBtn.onclick = () => {
    const newText = editArea.value.trim();
    if (newText) {
      let notes = JSON.parse(localStorage.getItem("notes")) || [];
      notes[index] = newText;
      localStorage.setItem("notes", JSON.stringify(notes));
      loadNotes();
    }
  };

  noteDiv.innerHTML = "";
  noteDiv.appendChild(editArea);
  noteDiv.appendChild(saveEditBtn);
}

function deleteNote(index, noteElement) {
  gsap.to(noteElement, {
    duration: 0.4,
    opacity: 0,
    scale: 0.8,
    ease: "power2.in",
    onComplete: () => {
      let notes = JSON.parse(localStorage.getItem("notes")) || [];
      notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
      loadNotes();
    },
  });
}

function viewNote(noteContent) {
  const modal = document.createElement("div");
  modal.className = "note-modal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.background = "white";
  modal.style.padding = "25px";
  modal.style.borderRadius = "14px";
  modal.style.boxShadow = "0 15px 40px rgba(0,0,0,0.18)";

  const noteText = document.createElement("p");
  noteText.textContent = noteContent;
  modal.appendChild(noteText);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.className = "delete-btn";
  closeBtn.style.background = "#e53935";
  closeBtn.onclick = () => document.body.removeChild(modal);
  modal.appendChild(closeBtn);

  document.body.appendChild(modal);
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-mode");

  // 3D animated background color transition
  if (body.classList.contains("dark-mode")) {
    gsap.to(body, {
      backgroundColor: "#121212",
      duration: 0.7,
      ease: "power2.out",
    });
  } else {
    gsap.to(body, {
      backgroundColor: "#e0f7fa",
      duration: 0.7,
      ease: "power2.out",
    });
  }

  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.forEach((_, index) => {
    const noteDiv = document.getElementById(`note-${index}`);
    if (noteDiv) {
      noteDiv.classList.toggle("dark-mode");
    }
  });

  const themeToggleBtn = document.getElementById("themeToggle");
  if (body.classList.contains("dark-mode")) {
    themeToggleBtn.textContent = "Light Theme";
    themeToggleBtn.style.background = "#ffb300";
  } else {
    themeToggleBtn.textContent = "Dark Theme";
    themeToggleBtn.style.background = "#5c6bc0";
  }
}
