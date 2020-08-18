const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((request, response) => {
    console.log("Someone accessed the server");

    if(request.url !== '/favicon.ico') {
        
        const pathName = url.parse(request.url, true).pathname;
        const id = url.parse(request.url, true).query.id;
        
        if(pathName === '/products' || pathName === '/') {
            response.writeHead(200, { 'Content-Type': 'text/HTML'});
            response.end('This is the PRODUCTS page');
        }
        else if(pathName === '/laptop' && id < laptopData.length) {
            response.writeHead(200, { 'Content-Type': 'text/HTML'});
            
            const laptop = laptopData[id];

            fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (error, data) => {
                let output = data.replace(/{%PRODUCTNAME%}/g, laptop.productName);
                output = output.replace(/{%PRICE%}/g, laptop.price);
                output = output.replace(/{%SCREEN%}/g, laptop.screen);
                output = output.replace(/{%CPU%}/g, laptop.cpu);
                output = output.replace(/{%IMAGE%}/g, laptop.image);
                output = output.replace(/{%STORAGE%}/g, laptop.storage);
                output = output.replace(/{%RAM%}/g, laptop.ram);
                output = output.replace(/{%DESCRIPTION%}/g, laptop.description);

                response.end(output);
            });

        }

        else {
            response.writeHead(404, { 'Content-Type': 'text/HTML'});
            response.end('URL was not found on the server');
        }
    }

});


server.listen(1337, '127.0.0.1', () => {
    console.log("Listening port 1337 of localhost");
})