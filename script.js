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

  document.getElementById(`qtd-${index}`).innerText =
    produtos[index].qtd;

  atualizarTotal();
}

function atualizarTotal() {
  let total = 0;

  produtos.forEach(produto => {
    total += produto.preco * produto.qtd;
  });

  document.getElementById("total").innerText =
    `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function enviarPedido() {
  let mensagem = "🍟 *PEDIDO - V.E BATATAS*%0A%0A";

  let total = 0;

  produtos.forEach(produto => {
    if (produto.qtd > 0) {

      const subtotal = produto.qtd * produto.preco;

      total += subtotal;

      mensagem += `• ${produto.nome} x${produto.qtd} = R$ ${subtotal.toFixed(2).replace('.', ',')}%0A`;
    }
  });

  mensagem += `%0A💰 *TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*`;

  const numero = "5585992418588";

  window.open(
    `https://wa.me/${numero}?text=${mensagem}`,
    "_blank"
  );
}
