import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity'
import _ from 'lodash'


class Store {
  constructor() {
    const region = 'us-east-1'

    this.subscriptions = []
    this.catalog = []
    this.page = {
      navItems: [],
      navSelected: '',
      playlist: [],
      playerlist: []
    }
    this.cred = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region }),
      identityPoolId: 'us-east-1:d78ad54c-3a62-4e9a-9549-f203580ba151'
    })
    this.client = new S3Client({ credentials: this.cred, region })
    this.cmd = new ListObjectsCommand({ Bucket: 'media.rideoutlane.com' })
    this.getNavItems()
  }

  getPage() {
    return this.page
  }

  async getNavItems() {
    try {
      const response = await this.client.send(this.cmd)
      this.catalog = _.map(response.Contents, item => item.Key)
      this.buildPage()
    } catch (error) {
      console.error(error)
    }
  }

  buildPage() {
    const djNames = _.map(this.catalog, item => item.substring(0, item.indexOf('/')))
    this.page.navItems = _.uniq(djNames)
    setTimeout(this.publish(), 0)
  }

  buildCard(item) {
    const trackName = item.substring(item.indexOf('/') + 1)

    if (!trackName) return null

    return {
      id: item,
      url: 'http://media.rideoutlane.com/' + item,
      displayText: trackName,
      selected: false
    }
  }

  setArtist(id) {
    this.page.navSelected = id
    this.page.playlist = _.compact(_.map(_.filter(this.catalog, item => _.startsWith(item, id)), this.buildCard))
    this.buildPage()
  }

  setSelection(id) {
    this.page.trackSelected = id
    this.page.playerlist = [_.find(this.page.playlist, item => item.id === id)]
    this.buildPage()
  }

  publish(list) {
    _.forEach(this.subscriptions, subscription => {
      setTimeout(subscription.callback(this.page), 0)
    })
  }

  subscribe(key, callback) {
    let existing = _.find(this.subscribtions, subscription => subscription.key === key)
    if (existing) {
      existing = callback
    } else {
      this.subscriptions.push({ key, callback })
    }
  }

  unsubscribe(key) {
    _.remove(this.subscriptions, subscription => subscription.key === key)
  }
}

export default new Store()
