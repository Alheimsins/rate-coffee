/* eslint-env browser */

import { Fragment, Component } from 'react'
import Layout from '../components/layout'
import { MdSearch } from 'react-icons/lib/md'
import { Link } from '../routes'
import { getNearbyCafes, searchCafes } from '../lib/places'

const Locations = ({ results = false, search, latitude, longitude, gps, getLocation, state }) => (
  <Layout>
    <div className='main'>
      {
        gps &&
          <Fragment>
            <div className='gps' aria-label='Locate nearby places' role='button' onClick={() => getLocation()}>
              <img alt='gps' style={{ verticalAlign: 'middle' }} src='/static/gps_locate.svg' width='70px' />
              <span style={{ fontSize: '12px', verticalAlign: 'middle', color: '#20864f' }}>{' <-'} click to locate nearby places</span>
            </div>
            <div><i style={{ color: '#656565' }}>- or -</i></div>
            <br />
          </Fragment>
      }
      <div className='container'>
        <label htmlFor='search' style={{ display: 'none' }}>SEARCH</label>
        <div className='search'>
          <input aria-label='Search input' name='search' onKeyDown={e => e.keyCode === 13 && search(e.target.value)} type='text' placeholder='Search for a place e.g. Fylkeshuset Skien' />
          <span style={{ cursor: 'pointer' }} role='button' aria-label='Submit search input' onClick={e => e.currentTarget.previousElementSibling.value && search(e.currentTarget.previousElementSibling.value)}><MdSearch /></span>
        </div>
        { state && <Fragment><br />{ state }</Fragment> }
        <div className='results'>
          <br />
          <ul>
            {
              results && (results.error
                ? <div style={{ color: '#ce6475' }}>{results.error}</div>
                : results.map(item => <li key={item.place_id}><Link route={`/place/${item.place_id}`}><a>{item.name} <i style={{ color: '#656565' }}>{item.formatted_address}</i></a></Link></li>)
              )
            }
          </ul>
        </div>
      </div>
    </div>
    <style jsx>
      {`
        .container {
          width: 40%;
          margin: auto;
        }
        @media screen and (max-width: 800px) {
          .container {
            width: 70% !important;
          }
        }
        @media screen and (max-width: 500px) {
          .container {
            width: 90% !important;
          }
        }
        .gps {
          cursor: pointer;
        }
        ul {
          padding: 0;
        }
        .results {
          margin-top: 10px;
          text-align: left;
        }
        a {
          text-decoration: none;
          color: black;
        }
        .main {
          margin-top: 40px;
        }
        .search {
          border-bottom: 1px solid black;
          width: 100%;
          padding-bottom: 4px;
          display: inline-flex;
        }
        input {
          border: 0;
          width: 100%;
          -moz-appearance: textfield;
          background: transparent;
        }
        input[type='text'] {
          font-family: 'Courier New', Courier, monospace;
        }
        input:focus {
          outline-width: 0;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
           margin: 0;
        }
        li {
          list-style-type: none;
          padding-bottom: 10px;
        }
      `}
    </style>
  </Layout>
)

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.getLocation = this.getLocation.bind(this)
    this.geoLocationSuccess = this.geoLocationSuccess.bind(this)
    this.geoLocationError = this.geoLocationError.bind(this)
    this.search = this.search.bind(this)
  }

  componentDidMount () {
    if (navigator && navigator.geolocation) this.setState({ gps: true })
  }

  geoLocationError () {
    this.setState({ gps: false, results: { error: 'No nearby places found.' }, state: false })
  }

  async geoLocationSuccess ({ coords = false }) {
    if (!coords) return
    const { latitude, longitude } = coords
    console.log(`Found location ${latitude}, ${longitude}`)
    this.setState({ state: 'Getting places...' })
    try {
      const results = await getNearbyCafes(latitude, longitude)
      this.setState({ latitude, longitude, results, state: false })
    } catch (error) {
      console.log(error)
    }
  }

  async search (inputText) {
    try {
      this.setState({ state: 'Getting places...' })
      const results = await searchCafes(inputText)
      this.setState({ results, state: false })
    } catch (error) {
      console.log(error)
    }
  }

  getLocation () {
    if (navigator && navigator.geolocation) {
      console.log('Update location')
      this.setState({ state: 'Finding location...' })
      navigator.geolocation.getCurrentPosition(this.geoLocationSuccess, this.geoLocationError, { enableHighAccuracy: true, timeout: 5000 })
    }
  }

  render () {
    return (
      <Fragment>
        <Locations search={this.search} getLocation={this.getLocation} {...this.state} />
      </Fragment>
    )
  }
}
