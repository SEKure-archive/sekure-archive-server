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

function addFile(folder, name, mime, size, created) {
    let body = {
        region: 'us-east-1',
        accessKeyID: 'TOPSECRET',
        secretAccessKey: 'TOPSECRET',
        folder: folder,
        name: name,
        mime: mime,
        size: size,
        created: created,
        s3: `sekure-archive${folder}/${name}`,
    };
    makeRequest('POST', '/files', body, null);
}

function addFolder(authorization, path) {
    let headers = { authorization: `Bearer ${authorization}` };
    makeRequest('POST', '/folders', { path: path }, headers, (body) => {
        addFile(path, 'a.txt', 'text/plain', 1011, '2017-03-19 04:17');
        addFile(path, 'b.txt', 'text/plain', 1512341, '2017-03-19 04:18');
        addFile(path, 'c.txt', 'text/plain', 1241235123, '2017-03-19 04:19');
        addFile(path, 'a.txt', 'text/plain', 2051, '2017-03-19 04:17');
        addFile(path, 'b.txt', 'text/plain', 2512315, '2017-03-19 04:18');
        addFile(path, 'c.txt', 'text/plain', 2184123891, '2017-03-19 04:19');
        addFile(path, 'a.txt', 'text/plain', 4051, '2017-03-19 04:17');
        addFile(path, 'b.txt', 'text/plain', 4012312, '2017-03-19 04:18');
        addFile(path, 'c.txt', 'text/plain', 4512351233, '2017-03-19 04:19');
        addFile(path, 'a.txt', 'text/plain', 8141, '2017-03-19 04:17');
        addFile(path, 'b.txt', 'text/plain', 8151233, '2017-03-19 04:18');
        addFile(path, 'c.txt', 'text/plain', 8912581274, '2017-03-19 04:19');
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
