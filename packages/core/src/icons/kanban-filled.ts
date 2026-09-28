import { defineIcon } from '../lib/icon-definition.js';

export const iconKanbanFilled = defineIcon({
  name: 'kanban-filled',
  category: 'system',
  tags: ['board', 'workflow', 'tasks', 'filled'],
  paths: ['M2 3h6v7H2zM2 12h6v9H2zM9 3h6v11H9zM16 3h6v7h-6zM16 12h6v9h-6z'],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
