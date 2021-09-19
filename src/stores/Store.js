import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3'
import { fromIni } from '@aws-sdk/credential-provider-ini'
import _ from 'lodash'

class Store {
  constructor() {
    this.subscriptions = []
    this.catalog = []
    this.page = {
      navItems: [], // _.map(catalog, 'name'),
      navSelected: '',
      playlist: [],
      playerlist: []
    }
    this.cred = fromIni({})
    this.client = new S3Client({ credentials: { accessKeyId: 'AKIAQFWKIYXT32P3DB55', secretAccessKey: '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' }, region: 'us-east-1' })
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
