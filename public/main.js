const broContainer = document.querySelector('.js-render-bro');

axios.get('/getbro')
    .then((response) => {
        if (response.data && response.data.success) {
            renderSuccess(response.data);
        } else {
            renderError();
        }
    })
    .catch(() => {
        renderError();
    });



function renderSuccess(data) {
    broContainer.innerHTML = getHtml(data);
    broContainer.classList.add('_is-loaded');
}

function renderError() {
    broContainer.innerHTML = 'ERROR :(';
    broContainer.classList.add('_is-loaded');
}

function getHtml(data) {
    function getList(arr) {
        let list = '';

        arr.forEach(bro => {
            list += `<li>${bro[0]}: ${bro[1]}</li>`;
        });

        return list;
    }

    let html = `
        <p>
            Last update: ${data.lastUpdate}<br/>
            Database version: ${data.dbVersion}
        </p>

        <div class="lists">
            <div>
                <h2 class="h2">Desktop</h2>
                <ul class="list">
                    ${getList(data.desktop)}
                </ul>
            </div>

            <div>
                <h2 class="h2">Mobile</h2>
                <ul class="list">
                    ${getList(data.mobile)}
                </ul>
            </div>
        </div>
        `

    return html;
}
