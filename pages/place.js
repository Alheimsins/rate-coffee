import Vote from '../components/vote'
import { Component } from 'react'
import axios from 'axios'
import getConfig from 'next/config'
const { publicRuntimeConfig: { HOST_URL } } = getConfig()

export default class extends Component {
  static async getInitialProps ({ query }) {
    try {
      const { id } = query
      const { data: { result } } = await axios({ url: `${HOST_URL}/getById`, params: { id } })
      return { result }
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    return <Vote result={this.props.result} />
  }
}
