# Redirects In Shell Basics

The shell in Linux provides a robust way of managing input and output streams of a command or program, this mechanism is known as Redirection. Linux being a multi-user and multi-tasking operating system, every process typically has 3 streams opened:

- Standard Input (stdin) - This is where the process reads its input from. The default is the keyboard.
- Standard Output (stdout) - The process writes its output to stdout. By default, this means the terminal.
- Standard Error (stderr) - The process writes error messages to stderr. This also goes to the terminal by default.

Redirection in Linux allows us to manipulate these streams, advancing the flexibility with which commands or programs are run. Besides the default devices (keyboard for input and terminal for output), the I/O streams can be redirected to files or other devices.

For example, if you want to store the output of a command into a file instead of printing it to the console, we can use the '>' operator.

```bash
ls -al > file_list.txt
```

This command will write the output of 'ls -al' into 'file_list.txt', whether or not the file initially existed. It will be created if necessary, and if it already exists – it will be overwritten.
