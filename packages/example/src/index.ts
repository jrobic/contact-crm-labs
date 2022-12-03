export function sayHello(name: string) {
  return `Hello from ${name}`;
}

export function main() {
  // eslint-disable-next-line no-console
  console.log(sayHello("Joe"));
}

main();
