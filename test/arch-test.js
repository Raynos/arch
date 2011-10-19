var arch = require("../src/arch.js"),
	Arch = arch.Arch,
	tester = arch.tester,
	path = require("path"),
	assert = require("assert");

arch.pd.extendNatives(true);

module.exports = {
	"test arch": function () {
		assert(arch.Arch);
		assert(arch.Stack);
		assert(arch.rest);
		assert(arch.error);
		assert(arch.f);
		assert(arch.tester);
		assert(arch.after);
		assert(arch.pd);
	},
	"test Arch.error": function () {
		var error = Arch.error();
		var obj = {};
		var messages = [];
		obj.write = function (d) {
			messages.push(d)
		};
		obj.end = function (d) {
			messages.push(d);
		}
		error.call({
			errors: [new Error("foo")]
		}, null, obj);
		assert(obj.statusCode === 500);
		assert.equal(messages[0], "foo");
		assert(messages[1]);
		assert.equal[messages[2], undefined];
		error.call({
			errors: []
		}, null, obj);
		assert.equal(messages[3], "unexpected server error");
	},
	"test Arch.static": function () {
		var static = Arch.static(path.join(__dirname, "static"));
		static.call({
			passErrorsTo: arch.Stack.passErrorsTo
		}, {
			url: "foo.txt"
		}, {
			writeHead: function () { },
			end: function (text) {
				assert.equal(text, "bar");
			}
		});
	}
};

if (!module.parent) {
	tester(module.exports);
}
