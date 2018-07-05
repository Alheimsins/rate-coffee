/* eslint-env browser */

import axios from 'axios'
const unique = results => results.sort((a, b) => a.name.localeCompare(b.name)).filter((curr, i, arr) => i === 0 || curr.name !== arr[i - 1].name)

export const getNearbyCafes = async (lat, long) => {
  try {
    const { data: { results } } = await axios(`${location.origin}/getNearbyCafes?lat=${lat}&long=${long}`)
    const uniqueResults = results.length > 0 ? unique(results) : { error: 'No nearby places found.' }
    console.log('Found results', uniqueResults)
    return uniqueResults
  } catch (error) {
    console.log(error)
  }
}

export const searchCafes = async (inputText) => {
  try {
    const { data } = await axios({ url: `${location.origin}/search`, params: { inputText } })
    const results = data.status === 'OK' || data.candidates.length > 0 ? unique(data.candidates) : { error: 'Nothing found. Try another search' }
    console.log('Found results', results)
    return results
  } catch (error) {
    console.log(error)
  }
}
