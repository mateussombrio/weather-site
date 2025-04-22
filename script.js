// const searchBar = document.querySelector("submit input[type='text']")

 async function getLocation(location) {
    const res =  await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`)
    const data = await res.json()
    return data
 }
 
console.log(getLocation('Florianópolis'))