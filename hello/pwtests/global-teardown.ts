// A teardown that never finishes and never prints: the shape of a stuck cleanup (a DB connection that
// is never closed, a server stop that hangs). The interval only keeps the process alive; it is silent.
export default async function globalTeardown(): Promise<void> {
  await new Promise<void>(() => {
    setInterval(() => {}, 60_000);
  });
}
