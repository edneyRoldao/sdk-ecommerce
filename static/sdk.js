const page = 'http://192.168.15.14:9010/index.html';
const firstStyle = 'http://192.168.15.14:9010/style.css';
const logoEai = 'http://192.168.15.14:9010/eai_logo.png';
const iconsStyle = 'https://fonts.googleapis.com/icon?family=Material+Icons';
const partnerOrderDetailUrl = 'http://192.168.15.14:3000/api/order';

async function createEcommerceOrder(orderId, token) {
    const response = await httpRequest('GET', page);
    const modalObj = initialConfig(response);
    processOrderCreation(modalObj.modal, modalObj.overlay, orderId, token);
}

async function processOrderCreation(modal, overlay, orderId, token) {
    switchPage('eaisdk_detail');
    
    const url = `${partnerOrderDetailUrl}/${orderId}`;

    const options = {
        headers: [
            {name: 'Authorization', value: 'testeTokenHeader'}
        ]
    }

    const orderDetail = await httpRequest('GET', url, options);    
    orderDetailBuilder(orderDetail);

    const order = {
        codigoPedido: 1234,
        idParceiro: 4545455,
        descricaoSite: 'www.souice.com.br',
        dataPedido: '10/05/2021',
        valorPedido: 125.00
    }
    orderDetailBuilder(order);


    openModal(modal, overlay);
}

function orderDetailBuilder(orderDetail) {
    const orderDetailEl = document.getElementById('eaisdk_detail');
    const orderSiteEl = document.getElementById('eaisdk_detail_site');
    const orderDateEl = document.getElementById('eaisdk_detail_data');
    const orderNumberEl = document.getElementById('eaisdk_detail_pedido');

    orderDetailEl.innerHTML = `R$ ${orderDetail.valorPedido} em ${orderDetail.descricaoSite}`;
    orderSiteEl.innerHTML = orderDetail.descricaoSite;
    orderDateEl.innerHTML = orderDetail.dataPedido;
    orderNumberEl.innerHTML = orderDetail.codigoPedido;
}

function addStylesheet(styleName) {
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = styleName;
    styles.media = 'all';
    styles.type = 'text/css';    
    document.querySelector('head').appendChild(styles);
}

function switchPage(pageId) {
    const pages = document.querySelectorAll('[sdk-html-switch]');
    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.remove('sdk-hidden');
            page.classList.add('sdk-show');
        } else {
            if (!page.classList.contains('sdk-hidden')) {
                page.classList.remove('sdk-show');
                page.classList.add('sdk-hidden');
            }    
        }
    })
}

function openModal(modal, overlay) {
    if (!modal) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal(modal, overlay) {
    if (!modal) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function initialConfig(partialHTML) {
    addStylesheet(firstStyle);
    addStylesheet(iconsStyle);

    const mainBody = document.querySelector('body');
    const mainDiv = document.createElement('div');

    mainDiv.innerHTML = partialHTML;
    mainBody.appendChild(mainDiv);

    const modal = document.getElementById('eaisdk_modal');
    const overlay = document.getElementById('overlay');
    const closeModalBtn = document.querySelectorAll('[data-close-button]');

    closeModalBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(modal, overlay);
        })
    });

    const imagesEl = document.querySelectorAll('.eaisdk_img');

    imagesEl.forEach(el => {
        el.src = logoEai;
    });

    return {modal, overlay};
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

        xhttp.onload = function () {
            this.status >= 200 && this.status < 300 ? resolve(xhttp.response) : reject({status: this.status, message: xhttp.statusText});
        };

        xhttp.onerror = function () {
            reject({status: this.status, message: xhttp.statusText});
        };

        xhttp.send(params);
    });
}
