import { type Metadata } from '../layouts'

export type MetadataFunction = (req: Request) => Promise<Metadata>
