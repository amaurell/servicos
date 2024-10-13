// app.js
// ***** Este programa está ligado direto a uma API na pasta API_02 ******

let registros = [];
let currentPage = 1;
const registrosPorPagina = 19; // Alterado para 19 registros por página
alert('NÃO INSERIR DATA COM INICIO 01')
function renderLista(list = registros) {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    const startIndex = (currentPage - 1) * registrosPorPagina;
    const endIndex = startIndex + registrosPorPagina;
    const registrosParaMostrar = list.slice(startIndex, endIndex);

    registrosParaMostrar.forEach(registro => {
        lista.innerHTML += `<tr>
                            <td class="data">${registro.data}</td>
                            <td class="histórico">${registro.historico}</td>
                            <td>${registro.cliente}</td>
                            <td class="tipo_nf">${registro.tipo_nf}</td>
                            <td class="valor">R$ ${registro.valor.toFixed(2)}</td>
                            <td>
                                <div class="d-flex justify-content-center">
                                    <i class="fas fa-trash-alt" onclick="deletarRegistro(${registro.id})" style="cursor: pointer;"></i>
                                </div>
                            </td>
                            </tr>`;
    });
    calcularTotal(list); // Passa a lista filtrada para o cálculo do total
    renderPaginas();
}

function aplicarFiltroAnual() {
    const cliente = document.getElementById('filterClienteAnual').value.toLowerCase().trim();
    const ano = document.getElementById('filterAno').value.trim();

    if (!cliente || !ano) {
        alert("Por favor, preencha todos os campos obrigatórios para o filtro anual.");
        return; // Se os campos obrigatórios não forem preenchidos, não continue
    }

    const registrosFiltrados = registros.filter(registro => {
        const date = new Date(registro.data);
        const anoRegistro = date.getFullYear().toString();
        const clienteMatch = registro.cliente.toLowerCase().includes(cliente);
        const anoMatch = anoRegistro === ano; // Filtro de ano

        return clienteMatch && anoMatch;
    });

    currentPage = 1; // Resetar para a primeira página ao aplicar filtro
    renderLista(registrosFiltrados);

    // Se não houver registros filtrados, atribui o total como zero
    if (registrosFiltrados.length === 0) {
        document.getElementById('totalValor').innerText = '0.00';
    }

    $('#filterModal').modal('hide'); // Fechar a modal após aplicar o filtro
}

function aplicarFiltroMensal() {
    const cliente = document.getElementById('filterClienteMensal').value.toLowerCase().trim();
    const mes = document.getElementById('filterMes').value;

    if (!cliente || !mes) {
        alert("Por favor, preencha todos os campos obrigatórios para o filtro mensal.");
        return; // Se os campos obrigatórios não forem preenchidos, não continue
    }

    const [ano, mesFiltrado] = mes.split('-'); // Divide a string ano-mês

    // Converte registros para datas exatas para garantir precisão no filtro
    const registrosFiltrados = registros.filter(registro => {
        const date = new Date(registro.data);
        const clienteMatch = registro.cliente.toLowerCase().includes(cliente);

        // Cria uma string no formato 'YYYY-MM' para o registro, ajustando o mês e dia
        const mesRegistro = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        // Verifica se o mês e ano são exatos
        return clienteMatch && mesRegistro === `${ano}-${mesFiltrado}`;
    });

    currentPage = 1; // Resetar para a primeira página ao aplicar filtro
    renderLista(registrosFiltrados);

    // Se não houver registros filtrados, atribui o total como zero
    if (registrosFiltrados.length === 0) {
        document.getElementById('totalValor').innerText = '0.00';
    }

    $('#filterModal').modal('hide'); // Fechar a modal após aplicar o filtro
}

function calcularTotal(filteredRecords) {
    let total = 0;
    if (filteredRecords && filteredRecords.length > 0) {
        total = filteredRecords.reduce((acc, registro) => acc + registro.valor, 0);
    } else {
        total = registros.reduce((acc, registro) => acc + registro.valor, 0);
    }
    document.getElementById('totalValor').innerText = total.toFixed(2);
}

function renderPaginas() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(registros.length / registrosPorPagina);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.className = 'btn mx-1';
        button.onclick = () => {
            currentPage = i;
            renderLista(); // Render lista do estado atual
        };
        if (i === currentPage) {
            button.disabled = true;
        }
        pagination.appendChild(button);
    }
}

async function getRegistros() {
    const response = await fetch('http://XXX.XXX.XXX:3000/registros');
    registros = await response.json();

    registros.sort((a, b) => new Date(b.data) - new Date(a.data));

    renderLista();
}

async function adicionarRegistro() {
    const data = document.getElementById('data').value;
    const historico = document.getElementById('historico').value;
    const cliente = document.getElementById('cliente').value;
    const tipo_nf = document.getElementById('tipo_nf').value;
    const valor = document.getElementById('valor').value;

    await fetch('http://185.218.125.113:3000/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, historico, cliente, tipo_nf, valor: parseFloat(valor) })
    });

    $('#addModal').modal('hide');
    getRegistros();
}

async function deletarRegistro(id) {
    await fetch(`http://185.218.125.113:3000/registros/${id}`, {
        method: 'DELETE'
    });

    getRegistros();
}

window.onload = () => {
    getRegistros();
};
