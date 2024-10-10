// ***** Este programa está ligado direto a uma API na pasta API_02 ******

let registros = [];
        let currentPage = 1;
        const registrosPorPagina = 15; // Mantido para 15 registros por página

        function renderLista() {
            const lista = document.getElementById('lista');
            lista.innerHTML = '';
            const startIndex = (currentPage - 1) * registrosPorPagina;
            const endIndex = startIndex + registrosPorPagina;
            const registrosParaMostrar = registros.slice(startIndex, endIndex);

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
            calcularTotal();
            renderPaginas();
        }

        function calcularTotal() {
            const total = registros.reduce((acc, registro) => acc + registro.valor, 0);
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
                    renderLista();
                };
                if (i === currentPage) {
                    button.disabled = true;
                }
                pagination.appendChild(button);
            }
        }

        async function getRegistros() {
            const response = await fetch('http://185.218.125.113:3000/registros');
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