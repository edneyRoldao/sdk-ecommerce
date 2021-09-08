let _orderId, _token, _orderInfo, _redirectUrl;
// const EcommerceSDKHost = 'https://sdk-ecommerce.herokuapp.com';
const EcommerceSDKHost = 'http://localhost:3000';



// PUBLIC FUNCTIONS
async function abrirModalConfirmacaoPedidoAbasteceAi(orderId, token) {
    _orderId = orderId;
    _token = token;

    const response = await _httpRequest('GET', `${EcommerceSDKHost}/index.html`);
    const modalObj = _initialConfig(response);

    _openModal(modalObj.modal, modalObj.overlay);

    _showProcessingPage("Aguarde enquanto buscamos os dados do pedido.");
    
    _getOrderDetail(modalObj.modal, modalObj.overlay);
}


// FUNCTIONS CALLED BY PAGES
async function confirmOrderFromPage() {
    _showProcessingPage("Aguarde enquanto processamos a sua solicitação para continuar o pagamento via Abastece aí");

    const request = _confirmOrderRequestBuilder();
    const response = await _httpRequest(request.method, request.url, request.options);
    const confirmationDetail = JSON.parse(response);

    if (!confirmationDetail || confirmationDetail.orderStatus === 'CONFIRMATION_ERROR') {
        const title = 'Erro ao confirmar pedido';
        const message = 'Ocorreu um erro inesperado ao confirmar o pedido'
        _showErrorPage(title, message);
        _redirectToPartnerPage(confirmationDetail.redirectUrl);
    } else {
        _redirectUrl = confirmationDetail.redirectUrl;
        _showAwaitingPaymentPage();
    }
}

function closeModalFromPage() {
    const modal = document.getElementById('eaisdk_modal');
    const overlay = document.getElementById('overlay');
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function redirectUrlFromPage() {
    _redirectToPartnerPage(_redirectUrl);
}


// PRIVATE FUNCTIONS
async function _getOrderDetail(modal, overlay) {
    const request = _orderDetailResquestBuilder();
    const response = await _httpRequest(request.method, request.url, request.options);
    const orderDetail = JSON.parse(response);

    if (orderDetail && orderDetail.orderId) {
        _showOrderDetailPage(orderDetail);

    } else {
        const title = 'Erro ao obter pedido';
        const message = 'Ocorreu um erro inesperado ao buscar as informações do pedido'
        _showErrorPage(title, message);
    }
}

function _orderDetailResquestBuilder() {
    const method = 'GET';
    const url = `${EcommerceSDKHost}/${_orderId}/order-info`;

    const options = {
        headers: [
            { name: 'token', value: _token }
        ]
    }

    return { method, url, options }
}


function _confirmOrderRequestBuilder() {
    const method = 'PUT';
    const url = `${EcommerceSDKHost}/${_orderId}/confirm-order`;

    const options = {
        headers: [
            { name: 'token', value: _token }
        ]
    }

    return { method, url, options }
}

function _addStylesheet(styleName) {
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = styleName;
    styles.media = 'all';
    styles.type = 'text/css';    
    document.querySelector('head').appendChild(styles);
}

function _switchPage(pageId) {
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

function _openModal(modal, overlay) {
    if (!modal) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal(modal, overlay) {
    if (!modal) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function _initialConfig(partialHTML) {
    _addStylesheet(`${EcommerceSDKHost}/style.css`);
    _addStylesheet('https://fonts.googleapis.com/icon?family=Material+Icons');

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

function _showOrderDetailPage(orderDetail) {
    const orderDetailEl = document.getElementById('eaisdk_detail_resume');
    const orderSiteEl = document.getElementById('eaisdk_detail_site');
    const orderDateEl = document.getElementById('eaisdk_detail_data');
    const orderNumberEl = document.getElementById('eaisdk_detail_pedido');
    _orderInfo = `R$ ${orderDetail.amount} em ${orderDetail.storeFantasyName}`;
    orderDetailEl.innerHTML = _orderInfo;
    orderSiteEl.innerHTML = orderDetail.storeSite;
    orderDateEl.innerHTML = orderDetail.creationDateTime;
    orderNumberEl.innerHTML = orderDetail.orderId;

    _switchPage('eaisdk_detail');
}

function _showAwaitingPaymentPage() {
    const orderInfoEl = document.getElementById('eaisdk_payment_orderInfo');
    orderInfoEl.innerHTML = _orderInfo;
    _switchPage('eaisdk_payment');
}

function _showProcessingPage(message) {
    const descriptionEl = document.getElementById('eaisdk_processing_description');
    descriptionEl.innerHTML = message;
    _switchPage('eaisdk_processing');
}

function _showErrorPage(title, message, orderIfo = '') {
    const infoEl = document.getElementById('eaisdk_error_info');
    const titleEl = document.getElementById('eaisdk_error_title');
    const messageEl = document.getElementById('eaisdk_error_message');                                                                                                    
    titleEl.innerHTML = title;
    infoEl.innerHTML = orderIfo;
    messageEl.innerHTML = message;
    _switchPage('eaisdk_error');
}

function _redirectToPartnerPage(url) {
    setTimeout(function() {            
        window.location(url);
    }, 5000);
}

function _httpRequest(method, url, options = {}) {
    return new Promise(function (resolve, reject) {
        const xhttp = new XMLHttpRequest();

        xhttp.open(method, url);

        const params = !!options.params ? options.params : '';
        const headers = !!options.headers ? options.headers : [];

        headers.forEach(header => {
            xhttp.setRequestHeader(header.name, header.value);            
        })

        xhttp.onload = function () {
            this.status >= 200 && this.status < 300 ? 
            resolve(xhttp.response) : 
            reject({status: this.status, message: xhttp.statusText});
        };

        xhttp.onerror = function () {
            reject({status: this.status, message: xhttp.statusText});
        };

        xhttp.send(params);
    });
}
