import '../scss/custom.scss'
import './css/styles.css';
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { fetchCountries } from './fetchCountries'
const debounce = require('lodash.debounce');


const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
}
const { input, countryList, countryInfo } = refs
let someBase = null

input.addEventListener('input', debounce(onInputChangeValue, DEBOUNCE_DELAY))

function onInputChangeValue(event) {
console.log(event.target.value.trim())
clearMarkup()
const name = event.target.value.trim()
    if (name.length >= 1) {
        fetchCountries(name)
            .then((responce) => {
            console.log(responce)
            localStorage.setItem('resp', JSON.stringify(responce))
            if (responce.length > 10) {
                return Notify.info("Too many matches found.Please enter a more specific name.");
            }
            if (responce.length !== 1) {
                countryArrayMarkup(responce)
            }
                if (responce.length === 1) {
                countryInfoMarkup(responce)
            }
        })
        .catch((error) => {
            clearMarkup()
            Notify.failure("Oops, there is no country with that name");
        });
    }
    
}

console.log(someBase)
function clearMarkup() {
    countryList.innerHTML=''
    countryInfo.innerHTML=''
}

function countryInfoMarkup(object) {

    const infoMarkup = object.map(({ name, flags, capital, population, languages }) => {

        const eachLanguage = Object.values(languages).map((el)=>el).join(", ")
        return `<p class="country_name"><img style="width:30px; margin-right:20px" class="country_flag" src="${flags.svg}" alt="${name.official}">${name.official}</p>
        <p class="country_capital">Capital: ${capital}</p>
        <p class="country_population">Population: ${population}</p>
        <p class="country_languages">Languages: ${eachLanguage}</p>`
    }).join('')
    
    countryInfo.insertAdjacentHTML('beforeend', infoMarkup)
}

function countryArrayMarkup(array) {
    const arrayMarkup = array.map(({ name, flags,}) =>
    {
        return `<li class="country_list_item" style="margin:10px;" ><img style="width:30px; margin-right:20px" src="${flags.svg}" alt="${name.common?name.common:name.official}"><span>${name.common?name.common:name.official}</span></li>`
    }).join("")

    countryList.insertAdjacentHTML('beforeend', arrayMarkup)
    const eachLi = document.querySelectorAll(".country_list_item")
    eachLi.forEach((li) => {
        li.addEventListener('click', onCountryNameClick)
    })
    
    console.log(eachLi)
}
function onCountryNameClick() {

    console.log(event.currentTarget)
    const LSbase = JSON.parse(localStorage.getItem('resp'))
    console.log(LSbase)
    
    const res = LSbase.map(({ name, flags, capital, population, languages }) => {
        
        console.log(event.currentTarget.innerText)
        console.log(name.common)
        console.log(flags)
        console.log(capital)
        console.log(population)
        // console.log(languages)
        const eachLanguage = Object.values(languages).map((el)=>el).join(", ")
        if (event.currentTarget.innerText === name.common) {
            return `<p class="country_name"><img style="width:30px; margin-right:20px" class="country_flag" src="${flags.svg}" alt="${name.official}">${name.official}</p>
        <p class="country_capital">Capital: ${capital}</p>
        <p class="country_population">Population: ${population}</p>
        <p class="country_languages">Languages: ${eachLanguage}</p>`
        }
    }).join('')
        clearInfoMarkup()
    
    countryList.insertAdjacentHTML('afterbegin', res)

}
function clearInfoMarkup() {
    console.dir(countryList)
    countryList.childNodes.forEach((elem) => {
        if (elem.nodeName === 'P') {
            elem.innerHTML = ''
        }
    })
}
clearInfoMarkup()