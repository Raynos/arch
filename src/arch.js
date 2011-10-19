var rest = require("rest"),
	pd = require("pd"),
	http = require("http"),
	after = require("after"),
	fs = require("fs"),
	path = require("path"),
	Stack = require("stak"),
	error = require("error"),
	f = require("fcombine"),
	tester = require("tester");

var staticStack = (function () {
	function _exists(res, pathname) {
		this.storeData({
			fun: path.exists.bind(path), 
			args: [pathname], 
			key: "exists"
		});
	}

	function _readFile(res, pathname) {
		function _readFile(err, file) {
			// TODO: fix mimetype
			var arr = pathname.split("."),
				type = arr[arr.length - 1],
				contentType;

			if (type === "html") {
				contentType = "text/html";
			} else if (type === "css") {
				contentType = "text/css";
			} else if (type === "js") {
				contentType = "application/ecmascript";
			}


			res.writeHead(200, {
				"Content-Type": contentType,
				"Content-Length": file.length
			});
			res.end(file);
		}

		if (this.exists) {
			fs.readFile(pathname, error.passTo(this.next, _readFile));
		} else {
			this.next(new Error("File doesn't exist"));	
		}
	}

	return pd.new(Stack, _exists, _readFile);
})(); 

var Arch = Object.create(http.Server.prototype, pd({
	/*
		creates a new Framework

		@return Frame
	*/
	constructor: function () {
		this.stack = Stack.new();

		http.Server.call(this, (function _handleRequest(req, res) {
			this.stack.handle({
				data: [req, res]
			});
		}).bind(this));
	},
	/*
		creates an error handling piece of middleware

		@return Function
	*/
	error: function _error() {
		return (function _errorHandler(req, res) {
			res.statusCode = 500;
			this.errors.forEach(function (error) {
				res.write(error.message);
				res.write(error.stack)
			});
			if (this.errors.length) {
				res.end();
			} else {
				res.end("unexpected server error");		
			}
		});
	},
	/*
		Load a folder of resources. Each resource will be called with the 
		rest object.

		@param String location - the location of the folder of resources
		@param Rest rest - an instance of rest the resources use to route with
	*/
	loadResources: function _loadResources(location, rest) {
		fs.readdir(location, error.throw(function (err, files) {
			files.forEach(function (file)  {
				require(location + file)(rest);
			});
		}));
	},
	/*
		Generates a middleware function to serve static content. all 
			incoming requests will be checked for whether the resource
			exists in the folderPath, if so that resource is send.

		Examples:

			server.stack.use(server.static(path.join(__dirname, "public")));

		@param String folderPath - a path to your folder containing
			static content

		@return Function
	*/
	static: function _static(folderPath) {
		return function _static(req, res) {
			var pathname = path.join(folderPath, req.url);
			var relative = path.relative(folderPath, pathname);
			if (!relative || relative.charAt(0) === ".") {
				return this.next();
			}

			staticStack.handle({
				data: [res, pathname],
				floor: this.passErrorsTo(this.next)
			});
		};
	}
}));

module.exports = {
	Arch: Arch,
	Stack: Stack,
	rest: rest,
	error: error,
	f: f,
	tester: tester,
	after: after,
	pd: pd
};
