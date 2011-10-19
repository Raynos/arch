# arch

Arch is an attempt at a toolkit-framework.

Arch exposes a set of tools

 - [stack][1]
 - [rest][2]
 - [trinity][3]
 - [error][4]
 - [f][5]
 - [tester][6]
 - [pd][7]
 - [after][8]

That can be used together to build web applications.

## Blog posts

[arch and toolkit frameworks][10]

## Examples

[vanilla-node][9]

## Documentation

Annotated Source code coming soon!

### Arch.new() 

Creates a new HTTP Server with Stack being used to handle http requests. The new stack will be exposed as this.stack

### Arch.error()

A stack-style function that can be used to handle errors in combination with stack.

	stack.use(Arch.error());

### Arch.static(folder)

A static file router that can be used with stack

	stack.use(Arch.static(__dirname + "/public"));

### Arch.loadResources(folder, rest)

Loads a folder of resources and passes the instance of rest to them.

   [1]: http://www.github.com/Raynos/stack
   [2]: http://www.github.com/Raynos/rest
   [3]: http://www.github.com/Raynos/trinity
   [4]: http://www.github.com/Raynos/error
   [5]: http://www.github.com/Raynos/f
   [6]: http://www.github.com/Raynos/tester
   [7]: http://www.github.com/Raynos/pd
   [8]: http://www.github.com/Raynos/after.js
   [9]: http://www.github.com/Raynos/vanilla-node
   [10]: http://raynos.org/blog/6/