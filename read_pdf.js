const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('Internal Resume Management System Documentation (1).pdf');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(function (error) {
    console.error("PDF Parsing Error:", error);
});
