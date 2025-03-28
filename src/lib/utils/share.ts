import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import type { List } from '@/lib/stores/list-store';

const ListSchema = z.object({
  v: z.literal(1),
  // ID is no longer shared - new one generated during deserialization
  title: z.string().max(100),
  items: z.array(z.object({
    text: z.string().max(200),
    completed: z.boolean(),
    emoji: z.string().default('🛒')
  })).max(100),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type SerializedList = z.infer<typeof ListSchema>;

export const serializeList = (list: List): string => {
  const rawData = {
    v: 1,
    // ID omitted intentionally
    title: list.title,
    items: list.items.map(item => ({
      text: item.text,
      completed: item.checked,
      emoji: item.emoji
    })),
    createdAt: new Date(list.createdAt).toISOString(),
    updatedAt: new Date(list.updatedAt).toISOString()
  };
  ListSchema.parse(rawData);
  return compressToEncodedURIComponent(JSON.stringify(rawData));
};

export const deserializeList = (input: string): List => {
  const decompressed = decompressFromEncodedURIComponent(input);
  if (!decompressed) throw new Error('Invalid share data');
  const parsed = JSON.parse(decompressed);
  const validated = ListSchema.parse({
    ...parsed,
    // Ensure backward compatibility for shared links without UUIDs
    id: parsed.id || uuidv4(),
    updatedAt: parsed.updatedAt || parsed.createdAt
  });
  return {
    ...validated,
    id: uuidv4(),
    createdAt: new Date(validated.createdAt),
    updatedAt: new Date(validated.updatedAt),
    items: validated.items.map(item => ({
      ...item,
      id: uuidv4(),
      checked: item.completed,
      emoji: item.emoji
    }))
  };
};
