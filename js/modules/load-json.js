export default async function loadJson(url) {
  let result;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => { result = data; });
  return result;
}
