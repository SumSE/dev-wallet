import db from '~/plugins/db'
import { state as baseState, mutations as baseMutations, actions as baseActions, getters as baseGetters } from '~/store/base'

export const strict = false

export const state = () => (_.cloneDeep(baseState()))

export const mutations = _.cloneDeep(baseMutations)
  
export const actions = _.cloneDeep(baseActions)
actions.collection = () => db.collection('bitcoin')

export const getters = _.cloneDeep(baseGetters)