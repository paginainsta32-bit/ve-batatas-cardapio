const produtos = [
  { nome: "Porção Pequena", preco: 5 },
  { nome: "Porção Média", preco: 10 },
  { nome: "Porção Grande", preco: 15 },
  { nome: "Fritas com Calabresa", preco: 15 },
  { nome: "Vatapá Pequeno", preco: 8 },
  { nome: "Vatapá Grande", preco: 12 },
  { nome: "Creme de Galinha Pequeno", preco: 8 },
  { nome: "Creme de Galinha Grande", preco: 12 },
  { nome: "Refrigerante Coca 200ml", preco: 3 },
  { nome: "Refrigerante Cajuina 200ml", preco: 3 },
];

const menu = document.getElementById("menu");

// Renderiza os produtos na tela
produtos.forEach((produto, index) => {
  produto.qtd = 0;

  menu.innerHTML += `
    <div class="item">
      <div class="info">
        <h3>${produto.nome}</h3>
        <p>R$ ${produto.preco.toFixed(2)}</p>
      </div>

      <div class="controls">
        <button onclick="alterarQtd(${index}, -1)">-</button>
        <span class="qtd" id="qtd-${index}">0</span>
        <button onclick="alterarQtd(${index}, 1)">+</button>
      </div>
    </div>
  `;
});

function alterarQtd(index, valor) {
  produtos[index].qtd += valor;

  if (produtos[index].qtd < 0) {
    produtos[index].qtd = 0;
  }

  document.getElementById(`qtd-${index}`).innerText = produtos[index].qtd;
  atualizarTotal();
}

function atualizarTotal() {
  let total = 0;
  produtos.forEach(produto => {
    total += produto.preco * produto.qtd;
  });

  document.getElementById("total").innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// VALIDAÇÃO INICIAL: Abre o modal se houver itens no carrinho
function enviarPedido() {
  let temItens = false;
  produtos.forEach(p => { if(p.qtd > 0) temItens = true; });

  if (!temItens) {
    alert("Por favor, adicione pelo menos um item ao seu cardápio antes de finalizar!");
    return;
  }

  document.getElementById("modal-pedido").classList.add("ativo");
}

function fecharModal() {
  document.getElementById("modal-pedido").classList.remove("ativo");
}

// Esconde ou mostra os campos de endereço dependendo da escolha
function verificarOpcaoEntrega() {
  const tipoEntrega = document.getElementById("entrega").value;
  const camposEndereco = document.getElementById("campos-endereco");
  const inputs = camposEndereco.querySelectorAll("input");

  if (tipoEntrega === "retirada") {
    camposEndereco.style.display = "none";
    inputs.forEach(input => input.removeAttribute("required"));
  } else {
    camposEndereco.style.display = "block";
    inputs.forEach(input => {
      if(input.id !== "referencia") input.setAttribute("required", true);
    });
  }
}

// Esconde ou mostra o campo de troco se a opção for dinheiro
function verificarOpcaoPagamento() {
  const formaPagamento = document.getElementById("pagamento").value;
  const campoTroco = document.getElementById("campo-troco");
  const inputTroco = document.getElementById("troco");

  if (formaPagamento === "Dinheiro") {
    campoTroco.style.display = "flex";
    inputTroco.setAttribute("required", true);
  } else {
    campoTroco.style.display = "none";
    inputTroco.removeAttribute("required");
  }
}

// FINALIZAÇÃO REAL: Formata os dados coletados e dispara para o WhatsApp
function enviarPedidoFormulario(event) {
  event.preventDefault();

  let mensagem = "🍟 *NOVO PEDIDO - V.E BATATAS*%0A%0A";
  
  let total = 0;
  produtos.forEach(produto => {
    if (produto.qtd > 0) {
      mensagem += `*${produto.qtd}x* ${produto.nome} (R$ ${(produto.preco * produto.qtd).toFixed(2)})\n`;
      total += produto.preco * produto.qtd;
    }
  });

  mensagem += `%0A💰 *Total dos Itens:* R$ ${total.toFixed(2).replace('.', ',')}%0A%0A`;
  mensagem += "────────────────────%0A%0A";

  const nome = document.getElementById("nome").value;
  const tipoEntrega = document.getElementById("entrega").value;
  const formaPagamento = document.getElementById("pagamento").value;

  mensagem += `👤 *Cliente:* ${nome}%0A`;
  
  if (tipoEntrega === "entrega") {
    const rua = document.getElementById("rua").value;
    const bairro = document.getElementById("bairro").value;
    const referencia = document.getElementById("referencia").value;
    
    mensagem += `🛵 *Forma:* Teleentrega%0A`;
    mensagem += `📍 *Endereço:* ${rua}, ${bairro}%0A`;
    if (referencia) mensagem += `📍 *Referência:* ${referencia}%0A`;
  } else {
    mensagem += `🛍️ *Forma:* Retirada no Local%0A`;
  }

  mensagem += `💳 *Pagamento:* ${formaPagamento}%0A`;

  if (formaPagamento === "Dinheiro") {
    const troco = document.getElementById("troco").value;
    mensagem += `💵 *Troco:* ${troco}%0A`;
  }

  // Número do seu WhatsApp (Mantive o que estava no seu código original)
  const numero = "5585992418588"; 
  
  window.open(`https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem.replace(/\n/g, '%0A'))}`, '_blank');
}

// ==========================================
// LÓGICA DO CARROSSEL
// ==========================================
let slideAtual = 0;
const slides = document.querySelectorAll('.carousel-item');
const pontos = document.querySelectorAll('.dot');
const tempoAuto = 4000; 
let intervaloCarrossel = setInterval(() => mudarSlide(1), tempoAuto);

function mostrarSlide(index) {
  if (index >= slides.length) { slideAtual = 0; }
  else if (index < 0) { slideAtual = slides.length - 1; }
  else { slideAtual = index; }

  slides.forEach(slide => slide.classList.remove('active'));
  pontos.forEach(ponto => ponto.classList.remove('active'));

  if(slides[slideAtual]) slides[slideAtual].classList.add('active');
  if(pontos[slideAtual]) pontos[slideAtual].classList.add('active');
}

function mudarSlide(direcao) {
  mostrarSlide(slideAtual + direcao);
  resetarTempoAtomatico();
}

function irParaSlide(index) {
  mostrarSlide(index);
  resetarTempoAtomatico();
}

function resetarTempoAtomatico() {
  clearInterval(intervaloCarrossel);
  intervaloCarrossel = setInterval(() => mudarSlide(1), tempoAuto);
}
