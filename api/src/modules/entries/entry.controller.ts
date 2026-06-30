import type { Request, Response } from 'express'
import * as entryService from './entry.service'
import { createEntrySchema, updateEntrySchema, listEntriesSchema } from './entry.schema'

export async function list(req: Request, res: Response) {
  const query = listEntriesSchema.parse(req.query)
  const result = await entryService.listEntries(req.user!.sub, query)
  res.json(result)
}

export async function getOne(req: Request, res: Response) {
  const entry = await entryService.findEntry(req.user!.sub, req.params.id)
  res.json(entry)
}

export async function create(req: Request, res: Response) {
  const body = createEntrySchema.parse(req.body)
  const entry = await entryService.createEntry(req.user!.sub, body)
  res.status(201).json(entry)
}

export async function update(req: Request, res: Response) {
  const body = updateEntrySchema.parse(req.body)
  const entry = await entryService.updateEntry(req.user!.sub, req.params.id, body)
  res.json(entry)
}

export async function remove(req: Request, res: Response) {
  await entryService.deleteEntry(req.user!.sub, req.params.id)
  res.status(204).send()
}

export async function stats(req: Request, res: Response) {
  const data = await entryService.getStats(req.user!.sub)
  res.json(data)
}
