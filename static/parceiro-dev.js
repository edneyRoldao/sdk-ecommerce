let token, prePedido, storeDocument, password, customerDocument;
const gatewayHost = 'https://ecommerce.gateway.rdeai-lab.net';

const characters = 'QWE0RTY1UIO2PAS3DFG4HJK5LZX6CVB7NMq8wer9tyu0iop1asd2fgh3jkl4zxc5vbn6m';

let produtosSelecionados = [];
const produtos = [
    {
        productId: "qwer-asdf-zxcv1",
        sku: "61414000036",
        name: "Calça Jeans Prod 1",
        value: 1945,
        discount: 0
    },
    {
        productId: "qwer-asdf-zxcv2",
        sku: "61414000037",
        name: "Calça Jeans Prod 2",
        value: 2573,
        discount: 0
    },
    {
        productId: "qwer-asdf-zxcv3",
        sku: "61414000038",
        name: "Calça Jeans Prod 3",
        value: 4110,
        discount: 0
    },
    {
        productId: "qwer-asdf-zxcv4",
        sku: "61414000039",
        name: "Calça Jeans Prod 4",
        value: 2430,
        discount: 0
    }
]

function login() {
    password = document.getElementById('ecm-pass').value;
    storeDocument = document.getElementById('ecm-user').value;
    customerDocument = document.getElementById('ecm-cus').value;

    let loginEl = document.getElementById('ecm-login');
    let shoppingEl = document.getElementById('ecm-shopping');

    loginEl.classList.remove('show');
    loginEl.classList.add('hide');

    shoppingEl.classList.remove('hide');
    shoppingEl.classList.add('show');

    let storeEl = document.getElementById('stoDocument');
    let storePassEl = document.getElementById('stoPassword');
    let customerEl = document.getElementById('cusDocument');
    storeEl.innerHTML = storeDocument;
    storePassEl.innerHTML = password;
    customerEl.innerHTML = customerDocument;
}

function adicionar(idProduto) {
    remover(idProduto);
    const qtd = document.getElementById(idProduto).value;
    let prod = produtos.find(p => p.productId === idProduto);
    prod.quantity = parseInt(qtd);
    produtosSelecionados.push(prod);
    sumarizar();
}

function remover(idProduto) {
    produtosSelecionados = produtosSelecionados.filter(p => p.productId !== idProduto);
    sumarizar();
}

function sumarizar() {
    const pTotalEl = document.getElementById('pTotal');
    const iTotalEl = document.getElementById('iTotal');
    const vTotalEl = document.getElementById('vTotal');

    pTotalEl.innerHTML = produtosSelecionados.length;

    iTotalEl.innerHTML = produtosSelecionados
        .map(p => p.quantity)
        .reduce((a, b) => a + b, 0);

    vTotalEl.innerHTML = produtosSelecionados
        .map(p => p.quantity * p.value)
        .reduce((a, b) => a + b, 0) / 100;
}

async function obterToken() {
    const req = tokenRequestBuilder();
    let response = await httpRequest(req.method, req.url, req.options);
    response = JSON.parse(response);
    const tokenEL = document.getElementById('tokenParceiro');
    tokenEL.innerHTML = response.token;
    token = response.token;
}

async function criarPedido() {
    const req = createOrderRequestBuilder();
    let response = await httpRequest(req.method, req.url, req.options);
    const pedidoEL = document.getElementById('dadosPedido');
    pedidoEL.innerHTML = response;
    prePedido = JSON.parse(response);
}

function pagarComAbasteceAI() {
    obterToken();

    setTimeout(function () {
        criarPedido();

        setTimeout(function () {
            const orderTokenEL = document.getElementById('orderToken');
            orderTokenEL.innerHTML = prePedido.orderToken;
            abrirModalConfirmacaoPedidoAbasteceAi(prePedido.orderToken);
            
        }, 3000);

    }, 3000);
}

function createOrderRequestBuilder() {
    const method = 'POST';
    const url = `${gatewayHost}/ecommerce/orders`;

    const pedido = {
        discount: 0,
        category: "e-commerce",
    };

    pedido.ownId = generateOwnId();
    pedido.items = produtosSelecionados;
    pedido.document = customerDocument;
    pedido.storeDocument = storeDocument;
    pedido.amount = produtosSelecionados.map(p => p.quantity * p.value).reduce((a, b) => a + b, 0);

    const options = {
        params: JSON.stringify(pedido),
        headers: [{ name: 'Authorization', value: token }]
    }

    return { method, url, options }
}

function tokenRequestBuilder() {
    const method = 'POST';
    const url = `${gatewayHost}/ecommerce/auth/generate-token`;

    const options = {
        params: JSON.stringify({ storeDocument, password })
    }

    return { method, url, options }
}

function httpRequest(method, url, options = {}) {
    return new Promise(function (resolve, reject) {
        const xhttp = new XMLHttpRequest();

        xhttp.open(method, url);

        const params = !!options.params ? options.params : '';
        const headers = !!options.headers ? options.headers : [];

        headers.forEach(header => {
            xhttp.setRequestHeader(header.name, header.value);
        })

        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onload = function () {
            this.status >= 200 && this.status < 300 ?
                resolve(xhttp.response) :
                reject({ status: this.status, message: xhttp.statusText });
        };

        xhttp.onerror = function () {
            reject({ status: this.status, message: xhttp.statusText });
        };

        xhttp.send(params);
    });
}

function generateOwnId(size = 10) {
    let code = '';

    for (let i = 0; i < size; i++) {
        const randomNumber = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomNumber)
    }

    return code;
}
