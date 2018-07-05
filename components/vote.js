/* eslint-env browser */

import { Component } from 'react'
import Gun from 'gun/gun'
import 'gun/lib/open'
import 'gun/lib/then'
import getConfig from 'next/config'
import Layout from './layout'
import { Link } from '../routes'

const { publicRuntimeConfig: { HOST_URL } } = getConfig()
const gun = Gun({
  peers: `${HOST_URL}/gun`
})

const todayDate = (date = new Date()) => `${date.getDate()}${date.getMonth()}${date.getYear()}`

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true
    }
    this.vote = this.vote.bind(this)
    this.votes = this.votes.bind(this)
  }

  votes () {
    let votes = []
    return {
      set: vote => {
        votes.push(vote)
        const totalVotes = votes.length
        const totalRating = totalVotes === 0 ? 0 : votes.map(i => i.vote).reduce((a, c) => a + c)
        const todayVotes = votes.filter(i => i.date === todayDate()).length || 0
        const todayRating = todayVotes === 0 ? 0 : votes.filter(i => i.date === todayDate()).map(i => i.vote).reduce((a, c) => c === 1 ? a + c : a + c)
        this.setState({ totalVotes, totalRating, todayVotes, todayRating })
      }
    }
  }

  async componentDidMount () {
    const voteList = this.votes()
    const { place_id: placeId } = this.props.result
    const id = todayDate() + placeId
    const voted = localStorage.getItem(id)
    gun.get('kaffe').get(placeId).map().on(s => voteList.set({vote: s.vote, date: s.date}))
    this.setState({ voted, loading: false })
  }

  async vote (vote) {
    const { place_id: placeId } = this.props.result
    const id = todayDate() + placeId
    localStorage.setItem(id, true)
    this.setState({ voted: true })
    await gun.get('kaffe').get(placeId).set({ vote, date: todayDate() }).then()
  }

  render () {
    const { totalVotes, totalRating, todayVotes, todayRating, voted, loading } = this.state
    const { vote } = this
    const { name } = this.props.result
    return (
      <Layout>
        <div>
          <div className='menu'>
            <Link route='/'><a>BACK</a></Link>
          </div>
        </div>
        <h1>The coffee at <i>{ name }</i></h1>
        <h3>bark or brew?</h3>
        <h1 className='votes'>{ totalRating || 0 }</h1>
        <div className='totalVotes'>{ totalVotes || 0 } votes</div>
        <div style={{ display: 'none' }}>{ todayRating + '/' + todayVotes }</div>
        {
          !loading && (voted
            ? <div>You have voted</div>
            : <div className='vote'>
              <span aria-label='Vote shitty coffee' role='button' name='bark' className='bark' onClick={() => vote(-1)}>
                <img alt='poop' src='/static/poop.jpg' height='100' />
              </span>
              <span aria-label='Vote good coffee' name='brygg' role='button' className='brygg' onClick={() => vote(1)}>
                <img alt='thumbs up' src='/static/thumbs_up.jpg' height='100' />
              </span>
            </div>
          )}
        <style jsx>
          {`
            .menu {
              margin-left: 10px;
              text-align: left;
            }
            a {
              color: black;
            }
            .totalVotes {
              color: #717171;
              margin-bottom: 10px;
            }
            .vote {
              margin-top: 10px;
            }
            h1 {
              font-weight: normal;
              margin: 0;
              margin-top: 40px;
            }
            h3 {
              color: #717171;
              font-weight: normal;
              margin: 0;
              margin-top: 5px;
              margin-bottom: 40px;
              font-style: italic;
            }
            .votes {
              color: ${totalRating < 0 ? '#ce6475' : '#63cc63'};
              font-size: 100px;
              font-weight: normal;
            }
            .bark, .brygg {
              cursor: pointer;
            }
            .bark {
              margin-right: 10%;
            }
          `}
        </style>
      </Layout>
    )
  }
}
