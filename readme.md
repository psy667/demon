# Nodemon but for everything
Demon is a tool that allows you to run any command on file change.
Files provides by stdin. The command provides by cli argument.

## Usage
```<stdin> | demon <command>```

## Examples
Run command on single file change
```sh
echo "main.go" | demon go run main.go
```

Run command on all files in current directory
```sh
ls | demon go run main.go
```
