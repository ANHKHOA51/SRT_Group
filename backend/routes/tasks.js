import express from 'express';
import db from '../db.js';

const router = express.Router();
const ALLOWED_STATUSES = ['pending', 'ongoing', 'completed'];

function validateTaskData(data) {
  const { title, status, deadline } = data;
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return 'Title is required and cannot be empty';
    }
    if (title.length > 255) {
      return 'Title cannot exceed 255 characters';
    }
  }
  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    return `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(', ')}`;
  }
  if (deadline) {
    const d = new Date(deadline);
    if (isNaN(d.getTime())) {
      return 'Invalid deadline date format';
    }
  }
  return null;
}

router.get('/', async (req, res) => {
  const { search, status, page = 1, limit = 5, sortBy = 'created_desc' } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({ error: 'Invalid page number' });
  }
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({ error: 'Invalid limit' });
  }

  const offset = (pageNum - 1) * limitNum;

  try {
    let query = db('tasks');

    if (search) {
      query = query.where(function () {
        this.where('title', 'ILIKE', `%${search}%`)
          .orWhere('description', 'ILIKE', `%${search}%`);
      });
    }

    if (status !== undefined && status !== 'all') {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Invalid status filter. Must be one of: ${ALLOWED_STATUSES.join(', ')}` });
      }
      query = query.where('status', status);
    }

    const totalQuery = query.clone().count('* as count').first();
    const activeQuery = query.clone().whereNot('status', 'completed').count('* as count').first();

    const [totalResult, activeResult] = await Promise.all([totalQuery, activeQuery]);
    const totalTasks = parseInt(totalResult.count, 10);
    const activeTasks = parseInt(activeResult.count, 10);

    let orderByCol = 'created_at';
    let orderDir = 'desc';
    let nullsLast = false;

    switch (sortBy) {
      case 'created_asc': orderByCol = 'created_at'; orderDir = 'asc'; break;
      case 'title_asc': orderByCol = 'title'; orderDir = 'asc'; break;
      case 'title_desc': orderByCol = 'title'; orderDir = 'desc'; break;
      case 'deadline_asc': orderByCol = 'deadline'; orderDir = 'asc'; nullsLast = true; break;
      case 'deadline_desc': orderByCol = 'deadline'; orderDir = 'desc'; nullsLast = true; break;
      case 'status_asc': orderByCol = 'status'; orderDir = 'asc'; break;
      case 'status_desc': orderByCol = 'status'; orderDir = 'desc'; break;
      case 'created_desc':
      default:
        orderByCol = 'created_at'; orderDir = 'desc'; break;
    }

    if (nullsLast) {
      query = query.orderByRaw(`${orderByCol} ${orderDir} NULLS LAST`);
    } else {
      query = query.orderBy(orderByCol, orderDir);
    }
    
    if (orderByCol !== 'created_at') {
      query = query.orderBy('created_at', 'desc');
    }

    const tasks = await query.limit(limitNum).offset(offset);

    res.json({
      tasks,
      totalTasks,
      activeTasks,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalTasks / limitNum)
    });
  } catch (error) {
    console.error('Error fetching tasks via Knex:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/', async (req, res) => {
  const { title, description, status, deadline } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const validationError = validateTaskData({ title, status, deadline });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const [newTask] = await db('tasks')
      .insert({
        title,
        description: description || '',
        status: status || 'pending',
        deadline: deadline || null,
      })
      .returning('*');

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task via Knex:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, deadline } = req.body;
  
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const validationError = validateTaskData({ title, status, deadline });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const task = await db('tasks').where({ id: idNum }).first();
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (deadline !== undefined) updates.deadline = deadline;

    updates.updated_at = db.fn.now();

    const [updatedTask] = await db('tasks')
      .where({ id: idNum })
      .update(updates)
      .returning('*');

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task via Knex:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    const deletedCount = await db('tasks')
      .where({ id: idNum })
      .delete()
      .returning('*');

    if (deletedCount.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', task: deletedCount[0] });
  } catch (error) {
    console.error('Error deleting task via Knex:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
