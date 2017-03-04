var request = require('request');

if (process.argv.length != 3) {
    throw new Error('expected one argument: [PORT]');
}

var URL = `http://127.0.0.1:${process.argv[2]}`;

function makeRequest(method, path, body, headers, callback) {
    request({
        method: method,
        url: `${URL}${path}`,
        json: true,
        body: body,
        headers: headers,
    }, (error, response, body) => {
        if (error) { throw error; }
        if (response.statusCode != 200) { throw new Error(JSON.stringify({ code: response.statusCode, body: response.body })); }
        if (callback) { callback(body); }
    });
}

function addUser(email, password, callback) {
    makeRequest('POST', '/accounts', { email: email, password: password }, null, callback);
}

function addFile(authorization, folder_id, name, mime) {
    let body = { folder_id: folder_id, name: name, mime: mime };
    makeRequest('POST', '/files', body, { authorization: authorization });
}

function addFolder(authorization, path) {
    let headers = { authorization: authorization };
    makeRequest('POST', '/folders', { path: path }, headers, (body) => {
        addFile(authorization, body.id, 'a.txt', 'text/plain');
        addFile(authorization, body.id, 'b.txt', 'text/plain');
        addFile(authorization, body.id, 'c.txt', 'text/plain');
        addFile(authorization, body.id, 'a.txt', 'text/plain');
        addFile(authorization, body.id, 'b.txt', 'text/plain');
        addFile(authorization, body.id, 'c.txt', 'text/plain');
        addFile(authorization, body.id, 'a.txt', 'text/plain');
        addFile(authorization, body.id, 'b.txt', 'text/plain');
        addFile(authorization, body.id, 'c.txt', 'text/plain');
        addFile(authorization, body.id, 'a.txt', 'text/plain');
        addFile(authorization, body.id, 'b.txt', 'text/plain');
        addFile(authorization, body.id, 'c.txt', 'text/plain');
    });
}

addUser('eric@samson.com', 'hunter322');
addUser('kyle@mayes.com', 'hunter322');
addUser('sean@mcglincy.com', 'hunter322', function(body) {
    addFolder(body.jwt, '/');
    addFolder(body.jwt, '/foo');
    addFolder(body.jwt, '/foo/subfoo');
    addFolder(body.jwt, '/bar');
    addFolder(body.jwt, '/bar/subbar');
    addFolder(body.jwt, '/baz');
    addFolder(body.jwt, '/baz/subbaz');
});
