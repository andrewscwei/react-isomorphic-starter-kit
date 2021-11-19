import { createSelector } from 'reselect'
import { AppState } from '../store'

export default createSelector([
  (state: AppState) => state.users,
], users => users)
