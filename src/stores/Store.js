import _ from 'lodash'

const catalog = [{
  id: 1,
  name: 'ROL',
  playlist: [{
    id: 1,
    url: 'http://media.rideoutlane.com/decksimus_&_cubanb__live@myth_20170101.mp3',
    displayText: 'Live @ Myth',
    selected: false
  },
  {
    id: 2,
    url: 'http://media.rideoutlane.com/club/radio_rehab_uncut_mix.mp3',
    displayText: 'Radio Rehab',
    selected: false
  }]
},
{
  id: 2,
  name: 'thPranksta',
  playlist: [{
    id: 1,
    url: 'http://media.rideoutlane.com/thpranksta/thpranksta__lbd25.mp3',
    displayText: 'LBD25',
    selected: false
  }]
},
{
  id: 3,
  name: 'Decksimus',
  playlist: [{
    id: 1,
    url: 'http://media.rideoutlane.com/decksimus__rideout.mp3',
    displayText: 'Rideout',
    selected: false
  },
  {
    id: 2,
    url: 'http://media.rideoutlane.com/decksimus__guerilla_warfunk.mp3',
    displayText: 'Guerilla Warfunk',
    selected: false
  }]
}]

let subscriptions
let page

class Store {
  constructor () {
    subscriptions = []
    page = {
      navItems: _.map(catalog, 'name'),
      navSelected: '',
      playlist: [],
      playerlist: []
    }
  }

  getPage () {
    return page
  }

  setArtist (id) {
    page.navSelected = id
    page.playlist = _.find(catalog, item => item.name === id).playlist
    setTimeout(this.publish(), 0)
  }

  setSelection (id) {
    page.trackSelected = id
    page.playerlist = [_.find(page.playlist, item => item.id === id)]
    setTimeout(this.publish(), 0)
  }

  publish (list) {
    _.forEach(subscriptions, subscription => {
      setTimeout(subscription.callback(page), 0)
    })
  }

  subscribe (key, callback) {
    let existing = _.find(this.subscribtions, subscription => subscription.key === key)
    if (existing) {
      existing = callback
    } else {
      subscriptions.push({ key, callback })
    }
  }

  unsubscribe (key) {
    _.remove(subscriptions, subscription => subscription.key === key)
  }
}

export default new Store()
