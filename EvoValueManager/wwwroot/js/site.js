function toggleDiv() {
    var formDiv = document.getElementById("editChallenge");
    if (formDiv.style.display === "none") {
        formDiv.style.display = "block";
    } else {
        formDiv.style.display = "none";
    }
}

function toggleAddCharacter() {
    var formDiv = document.getElementById("addCharacter");
    var editButton = document.getElementById("toggleAddCharacter");
    if (formDiv.style.display === "none") {
        formDiv.style.display = "block";
        editButton.textContent = "-";
    } else {
        formDiv.style.display = "none";
        editButton.textContent = "+";
    }
}

function toggleAddChallenge() {
    var formDiv = document.getElementById("addChallenge");
    var editButton = document.getElementById("toggleAddChallenge");

    if (formDiv.style.display === "none") {
        formDiv.style.display = "block";
        editButton.textContent = "-";
    } else {
        formDiv.style.display = "none";
        editButton.textContent = "+";
    }
    
    
}