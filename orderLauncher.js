const application = require('./application');

var readline = require('readline');
var r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

r.setPrompt('명령하세요 : ');
r.prompt();
r.on('line', function (line) {
    if (line === 'q') {
        r.close();
    }
    if(line === 'show$all') application.showAll(line);
    else if(line.slice(0,4) === 'show') application.showEachData(line);
    else if(line.slice(0,3) === 'add') application.addData(line);
    else if(line.slice(0,6) === 'delete') application.deleteData(line);
    else if(line.slice(0,6) === 'update') application.updateData(line);
    else{
        console.log('--invalid order');
        console.log('show$all\nshow$<status>\nadd$<name>$<["tag"]\ndelete$<id>\nupdate$<id>$<status>');
        r.prompt();
    }
});
r.on('close', function () {
    process.exit();
});


module.exports = {
    r
}


