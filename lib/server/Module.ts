import { type RenderFunction } from './RenderFunction'
import { type RobotsBuilder } from './RobotsBuilder'
import { type SitemapBuilder } from './SitemapBuilder'

export type Module = {
  render: RenderFunction
  robots?: RobotsBuilder
  sitemap?: SitemapBuilder
}
