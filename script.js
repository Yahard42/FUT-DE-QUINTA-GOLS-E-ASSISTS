// Inicialização do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    databaseURL: "SEU_DATABASE_URL",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Função para adicionar gols e assistências
function addStats(playerName, goals, assists) {
    const totalPoints = goals + (assists * 0.5);

    const playerRef = db.ref('ranking/' + playerName);
    playerRef.set({
        gols: goals,
        assistencias: assists,
        pontos: totalPoints
    });
}

// Função para pegar todos os jogadores do ranking
function getRanking() {
    const rankingRef = db.ref('ranking');

    rankingRef.once('value', (snapshot) => {
        const rankingData = snapshot.val();
        
        const rankingList = [];
        for (let player in rankingData) {
            rankingList.push({
                name: player,
                gols: rankingData[player].gols,
                assistencias: rankingData[player].assistencias,
                pontos: rankingData[player].pontos
            });
        }

        rankingList.sort((a, b) => b.pontos - a.pontos);

        displayRanking(rankingList);
    });
}

// Função para exibir o ranking
function displayRanking(rankingList) {
    const rankingTable = document.getElementById("rankingTable").getElementsByTagName('tbody')[0];
    rankingTable.innerHTML = '';

    rankingList.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.gols}</td>
            <td>${player.assistencias}</td>
            <td>${player.pontos}</td>
        `;
        rankingTable.appendChild(row);
    });
}

// Função para resetar o ranking
function resetRanking() {
    db.ref('ranking').set({});
    alert("Ranking resetado!");
}

// Evento do formulário para adicionar stats
document.getElementById('formStats').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const playerName = document.getElementById('playerName').value;
    const goals = parseInt(document.getElementById('goals').value);
    const assists = parseInt(document.getElementById('assists').value);
    
    addStats(playerName, goals, assists);
    getRanking(); // Atualiza o ranking após adicionar
});

// Inicializando o ranking quando a página for carregada
window.onload = getRanking;

