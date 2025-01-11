const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), { encoding: 'utf-8' });

stdout.write('Welcome! Please enter text to write to the file.\n');

stdin.on('data', (info) => {
  const input = info.toString().trim();
  if (input === 'exit') {
    process.exit();
  } else {
    output.write(info);
  }
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('\nGoodbye! Have a great day!\n'));