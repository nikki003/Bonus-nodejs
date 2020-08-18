const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((request, response) => {
    if(request.url !== '/favicon.ico') {
        
        const pathName = url.parse(request.url, true).pathname;
        console.log(pathName);
        const id = url.parse(request.url, true).query.id;
        
        // Product overview
        if(pathName === '/products' || pathName === '/') {
            response.writeHead(200, { 'Content-Type': 'text/HTML'});

            fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (error, data) => {
                let overviewOutput = data;
        
                fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (error, data) => {
                    let cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                    overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                    
                    response.end(overviewOutput);
                });
            });
        }

        // Laptop details
        else if(pathName === '/laptop' && id < laptopData.length) {
            response.writeHead(200, { 'Content-Type': 'text/HTML'});
            
            const laptop = laptopData[id];

            fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (error, data) => {
                const output = replaceTemplate(data, laptop);
                response.end(output);
            });

        }

        // Route images
        else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
            fs.readFile(`${__dirname}/data/img${pathName}`, (error, data) => {
                response.writeHead(200, { 'Content-Type': 'image/jpg'});
                response.end(data);
            })
        }

        // URL not found
        else {
            response.writeHead(404, { 'Content-Type': 'text/HTML'});
            response.end('URL was not found on the server');
        }
    }

});


server.listen(1337, '127.0.0.1', () => {
    console.log("Listening port 1337 of localhost");
});

const replaceTemplate = (originalHtml, laptop) => {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
};