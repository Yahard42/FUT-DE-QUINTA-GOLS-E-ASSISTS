// Verifica se já existem jogadores salvos no LocalStorage
let players = JSON.parse(localStorage.getItem("players")) || [];

// Atualiza o ranking na tela
function updateRanking() {
    let rankingTable = document.getElementById("rankingTable");
    rankingTable.innerHTML = "";

    // Ordena os jogadores pela pontuação
    players.sort((a, b) => b.points - a.points);

    players.forEach((player, index) => {
        let row = `
            <tr>
                <td>${index + 1}º</td>
                <td>${player.name}</td>
                <td>${player.goals}</td>
                <td>${player.assists}</td>
                <td>${player.points.toFixed(1)}</td>
            </tr>
        `;
        rankingTable.innerHTML += row;
    });

    // Salva a lista atualizada no LocalStorage
    localStorage.setItem("players", JSON.stringify(players));
}

// Adiciona estatísticas ao jogador
function addStats() {
    let name = document.getElementById("playerName").value.trim();
    let goals = parseInt(document.getElementById("goals").value) || 0;
    let assists = parseInt(document.getElementById("assists").value) || 0;

    if (name === "") {
        alert("Digite o nome do jogador!");
        return;
    }

    // Verifica se o jogador já está na lista
    let player = players.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (player) {
        player.goals += goals;
        player.assists += assists;
        player.points = player.goals + (player.assists * 0.5);
    } else {
        players.push({
            name: name,
            goals: goals,
            assists: assists,
            points: goals + (assists * 0.5)
        });
    }

    // Atualiza a interface
    updateRanking();

    // Limpa os campos
    document.getElementById("playerName").value = "";
    document.getElementById("goals").value = "";
    document.getElementById("assists").value = "";
}

// Inicializa a tabela ao carregar a página
updateRanking();

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "r") {  // Ctrl + R para resetar
        if (confirm("Tem certeza que deseja zerar o ranking?")) {
            localStorage.removeItem("players");
            location.reload();
        }
    }
});
