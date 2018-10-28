var http=require('http');
function onrequest(request,response){
	response.writeHead(200,{'Content-Type':'text/plain'});
	response.write("Hello world");
	response.end()
}
http.createServer(onrequest).listen(8000);
