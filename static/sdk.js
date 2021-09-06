let _orderId, _token, _orderInfo;
const EcommerceSDKHost = process.env.ecommerceSdk.host || 'https://sdk-ecommerce.herokuapp.com';


async function confirmEcommerceOrder(orderId, token) {
    _orderId = orderId;
    _token = token;

    const response = await httpRequest('GET', `${EcommerceSDKHost}/index.html`);
    const modalObj = initialConfig(response);

    processOrderConfirmation(modalObj.modal, modalObj.overlay);
}

async function processOrderConfirmation(modal, overlay) {
    switchPage('eaisdk_detail');

    const request = orderDetailResquestBuilder();
    let orderDetail = await httpRequest(request.method, request.url, request.options);
    orderDetail = JSON.parse(orderDetail);
    orderDetailBuilder(orderDetail);

    openModal(modal, overlay);
}


function orderDetailResquestBuilder() {
    const method = 'GET';
    const url = `${EcommerceSDKHost}/order-info`;

    const options = {
        headers: [
            { name: 'partnerToken', value: _token },
            { name: 'partnerOrderId', value: _token }
        ]
    }

    return {
        method,
        url,
        options
    }
}



async function sdkCreateOrder() {
    switchPage('eaisdk_processing');

    const request = createOrderRequestBuilder();
    const response = await httpRequest(request.method, request.url, request.options);


}


function createOrderRequestBuilder() {
    const method = 'POST';
    const url = `${EcommerceSDKHost}/confirm-order",`;

    const options = {
        headers: [
            { name: 'partnerToken', value: _token },
            { name: 'partnerOrderId', value: _token }
        ]
    }

    return {
        method,
        url,
        options
    }
}


function orderDetailBuilder(orderDetail) {
    const orderDetailEl = document.getElementById('eaisdk_detail_resume');
    const orderSiteEl = document.getElementById('eaisdk_detail_site');
    const orderDateEl = document.getElementById('eaisdk_detail_data');
    const orderNumberEl = document.getElementById('eaisdk_detail_pedido');

    const orderInfo = `R$ ${orderDetail.valorPedido} em ${orderDetail.descricaoSite}`;
    _orderInfo = orderInfo;
    orderDetailEl.innerHTML = orderInfo;
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

function closeModalFromPage() {
    const modal = document.getElementById('eaisdk_modal');
    const overlay = document.getElementById('overlay');
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function initialConfig(partialHTML) {
    addStylesheet(`${EcommerceSDKHost}/style.css`);
    addStylesheet('https://fonts.googleapis.com/icon?family=Material+Icons');

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
        el.src = `${EcommerceSDKHost}/eai_logo.png`;
    });

    return {modal, overlay};
}

function showPageError(title, message, orderIfo = '') {
    const infoEl = document.getElementById('eaisdk_error_info');
    const titleEl = document.getElementById('eaisdk_error_title');
    const messageEl = document.getElementById('eaisdk_error_message');
                                                                                                    
    switchPage('eaisdk_error');
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
