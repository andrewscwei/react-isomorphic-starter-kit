export async function getRandomQutoe() {
  return fetch('https://type.fit/api/quotes')
    .then(t => t.json())
    .then(t => t[Math.floor(Math.random() * t.length)])
}
