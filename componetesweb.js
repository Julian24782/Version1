class MyWebComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                table, th, td {
                    border: 1px solid black;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 10px;
                }
            </style>
            <div>
                <button id="listar">Listar</button>
                <button id="crear">Crear</button>
                <button id="editar">Editar</button>
                <button id="eliminar">Eliminar</button>
                <button id="otros">...</button>
                <table id="dataTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        `;

        this.data = [];
        this.dataTable = this.shadowRoot.querySelector('#dataTable tbody');

        this.shadowRoot.querySelector('#listar').addEventListener('click', this.listar.bind(this));
        this.shadowRoot.querySelector('#crear').addEventListener('click', this.crear.bind(this));
        this.shadowRoot.querySelector('#editar').addEventListener('click', this.editar.bind(this));
        this.shadowRoot.querySelector('#eliminar').addEventListener('click', this.eliminar.bind(this));
    }

    async listar() {
        const response = await fetch('cuentas.json');
        this.data = await response.json();
        this.renderTable();
    }

    crear() {
        const id = prompt('Ingrese ID:');
        const username = prompt('Ingrese Username:');
        const saldo = prompt('Ingrese Saldo:');
        const newData = { id: parseInt(id), username, saldo: parseFloat(saldo) };
        console.log('Nuevo objeto creado:', newData);
    }

    editar() {
        const id = prompt('Ingrese el ID del objeto a editar:');
        const index = this.data.findIndex(item => item.id == id);
        if (index !== -1) {
            const oldData = { ...this.data[index] };
            this.data[index].username = prompt('Ingrese nuevo Username:', this.data[index].username);
            this.data[index].saldo = parseFloat(prompt('Ingrese nuevo Saldo:', this.data[index].saldo));
            console.log('Objeto anterior:', oldData);
            console.log('Objeto actualizado:', this.data[index]);
        } else {
            console.log('ID no encontrado.');
        }
    }

    eliminar() {
        const id = prompt('Ingrese el ID del objeto que se a de eliminar:');
        const index = this.data.findIndex(item => item.id == id);
        if (index !== -1) {
            const deletedData = this.data.splice(index, 1)[0];
            console.log('Objeto eliminado:', deletedData);
            this.renderTable();
        } else {
            console.log('ID no encontrado.');
        }
    }

    renderTable() {
        this.dataTable.innerHTML = '';
        this.data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.username}</td>
                <td>${item.saldo}</td>
            `;
            this.dataTable.appendChild(row);
        });
    }
}

customElements.define('my-webcomponent', MyWebComponent);
