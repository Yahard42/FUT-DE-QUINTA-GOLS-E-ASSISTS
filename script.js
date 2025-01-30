// Histórico para desfazer ações
let historyStack = [];

// Atualiza a exibição do ranking
function updateRanking() {
    let players = JSON.parse(localStorage.getItem("players")) || {};
    let ranking = Object.entries(players).map(([name, stats]) => ({
        name: name,
        points: stats.goals + stats.assists * 0.5, // 1 gol = 1 ponto, 1 assistência = 0.5 ponto
        goals: stats.goals,
        assists: stats.assists
    }));

    // Ordena por pontuação (maior para menor)
    ranking.sort((a, b) => b.points - a.points);

    // Renderiza o ranking na tela
    let rankingTable = document.getElementById("ranking");
    rankingTable.innerHTML = ""; // Limpa antes de atualizar

    ranking.forEach((player, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.goals}</td>
            <td>${player.assists}</td>
            <td>${player.points.toFixed(1)}</td>
        `;
        rankingTable.appendChild(row);
    });
}

// Adiciona gol para um jogador
function addGoal(playerName) {
    let players = JSON.parse(localStorage.getItem("players")) || {};
    if (!players[playerName]) {
        players[playerName] = { goals: 0, assists: 0 };
    }

    historyStack.push(JSON.stringify(players)); // Salva estado anterior
    players[playerName].goals += 1;

    localStorage.setItem("players", JSON.stringify(players));
    updateRanking();
}

// Adiciona assistência para um jogador
function addAssist(playerName) {
    let players = JSON.parse(localStorage.getItem("players")) || {};
    if (!players[playerName]) {
        players[playerName] = { goals: 0, assists: 0 };
    }

    historyStack.push(JSON.stringify(players)); // Salva estado anterior
    players[playerName].assists += 1;

    localStorage.setItem("players", JSON.stringify(players));
    updateRanking();
}

// Atalho para voltar a última ação (Ctrl + Z)
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "z") { 
        if (historyStack.length > 0) {
            let previousState = historyStack.pop();
            localStorage.setItem("players", previousState);
            updateRanking();
        } else {
            alert("Não há ações para desfazer!");
        }
    }
});

// Atalho para resetar tudo (Ctrl + R)
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "r") {  
        if (confirm("Tem certeza que deseja zerar o ranking?")) {
            localStorage.removeItem("players");
            location.reload();
        }
    }
});

// Inicializa o ranking ao carregar a página
document.addEventListener("DOMContentLoaded", updateRanking);

