function toggleDiv() {
    var formDiv = document.getElementById("editChallenge");
    if (formDiv.style.display === "none") {
        formDiv.style.display = "block";
    } else {
        formDiv.style.display = "none";
    }
}

function confirmChallengeClose(selectedStateText) {
    const forbiddenStates = ["Befejezett", "Megszakítva"];

    if (!forbiddenStates.includes(selectedStateText)) {
        return confirm("Figyelem! A kihívás még nincs befejezve vagy megszakítva. Biztosan le szeretnéd zárni?");
    } else {
        return true;
    }
}