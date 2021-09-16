const broContainer = document.querySelector('.js-render-bro');
let updateAttempts = 0;

function getInfo() {
    broContainer.innerHTML = 'Loading ...';

    axios.get('/getbro')
        .then((response) => {
            if (response.data && response.data.success) {
                const timezoneOffset = new Date().getTimezoneOffset() * 60000;
                const yesterday = new Date().getTime() - 60000 * 60 * 24 + timezoneOffset;
                const lastUpdate = new Date(response.data.lastUpdate).getTime();

                if (lastUpdate < yesterday) {
                     // The database hasn't been updated recently, let's do it now
                    if (updateAttempts < 1) {
                        updateDatabase();
                    } else {
                        // Have already tried to update, but smth went wrong
                        renderError();
                    }
                } else {
                    renderSuccess(response.data);
                }
            } else {
                renderError();
            }
        })
        .catch(() => {
            renderError();
        });
}

getInfo();

function updateDatabase() {
    broContainer.innerHTML = 'Updating the database ...';

    axios.get('/update')
        .then((response) => {
            // To avoid recursion, count the attempts
            updateAttempts++;

            if (response && response !== 'Error') {
                getInfo();
            } else {
                renderError();
            }
        })
        .catch(() => {
            updateAttempts++;
            renderError();
        });
}

function renderSuccess(data) {
    broContainer.innerHTML = getHtml(data);
    broContainer.classList.add('_is-loaded');
}

function renderError() {
    broContainer.innerHTML = 'ERROR :(';
    broContainer.classList.add('_is-loaded');
}

function getHtml(data) {
    function getRow(arr) {
        let list = '';

        arr.forEach(bro => {
            list += `<tr>
                        <td>${bro[0]}</td> <td>${bro[1][0]}</td> <td>${bro[1][1]}</td>
                    </tr>`;
        });

        return list;
    }

    let html = `
        <p>
            Last database sync: ${data.lastUpdate}<br/>
            Database version: ${data.dbVersion}
        </p>

        <div class="lists">
            <div>
                <h2 class="h2">Desktop</h2>

                <table class="table">
                    <tr>
                        <th></th>
                        <th>Today</th>
                        <th>1 year ago *</th>
                    </tr>
                    ${getRow(data.desktop)}
                </table>
            </div>

            <div>
                <h2 class="h2">Mobile</h2>

                <table class="table">
                    <tr>
                        <th></th>
                        <th>Today</th>
                        <th>1 year ago</th>
                    </tr>
                    ${getRow(data.mobile)}
                </table>
            </div>
        </div>

        <small>* If&nbsp;the old version matches the current one, it&nbsp;may sometimes be&nbsp;incorrect, because the information about it&nbsp;is&nbsp;no&nbsp;longer updated</small>
        `

    return html;
}
