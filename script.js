let exercicioAtual = 1;
let pontuacao = 0;
let totalExercicios = 10;

// Sons de acerto e erro
const somAcerto = new Audio("assets/acerto.mp3");
const somErro = new Audio("assets/erro.mp3");

// Iniciar jogo ao clicar no botão
document.getElementById("iniciar").addEventListener("click", () => {
  document.getElementById("iniciar").style.display = "none"; // esconde botão iniciar
  document.getElementById("proximo").style.display = "inline-block"; // mostra botão próximo
  carregarExercicio(exercicioAtual);
});

async function carregarExercicio(numero) {
  try {
    const response = await fetch(`data/exercicio${numero}.json`);
    if (!response.ok) throw new Error("Arquivo não encontrado");
    const dados = await response.json();
    const container = document.getElementById("exercicio-container");

    container.innerHTML = `
      <p id="historia">${dados.historia}</p>
      <div class="grafico">
        ${dados.animais.map(animal => `
          <div class="linha-barra">
            <div class="label">${animal.nome}</div>
            <div class="bar">
              ${Array.from({ length: animal.quantidade }, () => `<div class="divisao"></div>`).join("")}
            </div>
            <span class="quantidade">${animal.quantidade}</span>
          </div>
        `).join("")}
      </div>
      <p id="pergunta"><strong>Pergunta:</strong> ${dados.pergunta}</p>
      <div class="opcoes">
        ${dados.animais.map(animal => `
          <button class="opcao" onclick="verificarResposta('${animal.nome}', '${dados.respostaCorreta}', '${dados.feedback.correto}', '${dados.feedback.errado}')">
            ${animal.nome}
          </button>
        `).join("")}
      </div>
      <p id="resultado"></p>
      <p id="pontuacao">Pontuação: ${pontuacao} / ${totalExercicios}</p>
    `;

    // 🔊 Ler história e pergunta (com cancel e delay para garantir execução)
    setTimeout(() => {
      lerTexto(dados.historia + ". " + dados.pergunta);
    }, 300);

  } catch (error) {
    console.error("Erro ao carregar exercício:", error);
    document.getElementById("exercicio-container").innerHTML = `<p>Erro ao carregar exercício ${numero}. Verifique se o arquivo existe.</p>`;
  }
}

function verificarResposta(escolha, respostaCorreta, msgCorreta, msgErrada) {
  const resultado = document.getElementById("resultado");
  if (escolha === respostaCorreta) {
    resultado.textContent = msgCorreta;
    resultado.style.color = "green";
    pontuacao++;
    somAcerto.play(); // 🔊 som de acerto
  } else {
    resultado.textContent = msgErrada;
    resultado.style.color = "red";
    somErro.play(); // 🔊 som de erro
  }

  document.getElementById("pontuacao").textContent = `Pontuação: ${pontuacao} / ${totalExercicios}`;

  if (exercicioAtual === totalExercicios) {
    const finalMsg = document.createElement("p");
    finalMsg.style.fontSize = "20px";
    finalMsg.style.fontWeight = "bold";
    finalMsg.style.color = "blue";
    finalMsg.textContent = `Fim do jogo! Você acertou ${pontuacao} de ${totalExercicios}. Parabéns! 🎉`;
    document.getElementById("exercicio-container").appendChild(finalMsg);

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Reiniciar Jogo";
    restartBtn.className = "reiniciar";
    restartBtn.onclick = reiniciarJogo;
    document.getElementById("exercicio-container").appendChild(restartBtn);

    soltarConfetes();
  }
}

function reiniciarJogo() {
  exercicioAtual = 1;
  pontuacao = 0;
  carregarExercicio(exercicioAtual);
}

// 🔊 Função para ler texto em voz alta
function lerTexto(texto) {
  speechSynthesis.cancel(); // cancela falas anteriores
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "pt-BR"; // voz em português
  speechSynthesis.speak(utterance);
}

document.getElementById("proximo").addEventListener("click", () => {
  exercicioAtual = exercicioAtual < totalExercicios ? exercicioAtual + 1 : 1;
  carregarExercicio(exercicioAtual);
});
