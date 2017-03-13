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

function addFile(authorization, folder_id, name, mime, size) {
    let body = { folder_id: folder_id, name: name, mime: mime, size: size };
    makeRequest('POST', '/files', body, { authorization: `Bearer ${authorization}` });
}

function addFolder(authorization, path) {
    let headers = { authorization: `Bearer ${authorization}` };
    makeRequest('POST', '/folders', { path: path }, headers, (body) => {
        addFile(authorization, body.id, 'a.txt', 'text/plain', 1011);
        addFile(authorization, body.id, 'b.txt', 'text/plain', 1512341);
        addFile(authorization, body.id, 'c.txt', 'text/plain', 1241235123);
        addFile(authorization, body.id, 'a.txt', 'text/plain', 2051);
        addFile(authorization, body.id, 'b.txt', 'text/plain', 2512315);
        addFile(authorization, body.id, 'c.txt', 'text/plain', 2184123891);
        addFile(authorization, body.id, 'a.txt', 'text/plain', 4051);
        addFile(authorization, body.id, 'b.txt', 'text/plain', 4012312);
        addFile(authorization, body.id, 'c.txt', 'text/plain', 4512351233);
        addFile(authorization, body.id, 'a.txt', 'text/plain', 8141);
        addFile(authorization, body.id, 'b.txt', 'text/plain', 8151233);
        addFile(authorization, body.id, 'c.txt', 'text/plain', 8912581274);
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
