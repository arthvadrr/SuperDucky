import db from '../../db/sqlite';
import { Router } from 'express';
import type { Request, Response } from 'express';
import type Excerpt from "../../types/Excerpt";


const router: Router = Router();

/**
 * Store the last excerpt id to prevent duplicates
 */
let lastExcerptId: number | null = null;

router.get('/excerpts-count', async (_: Request, res: Response): Promise<void> => {
  try {
    const result = (await db.prepare('SELECT COUNT(*) AS excerpt_count FROM excerpts').get()) as {
      excerpt_count: number
    } | undefined;

    if (!result) {
      res.status(404).json({ error: 'No excerpts found' });
      return;
    }

    res.status(200).json({ excerpt_count: result.excerpt_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch count' });
  }
});

router.get('/random-excerpt', async (_: Request, res: Response): Promise<void> => {
  try {
    let result = await db.prepare(`
      SELECT id,
             book_title,
             book_excerpt,
             book_author,
             book_author_race,
             book_author_role
      FROM excerpts
      ORDER BY RANDOM()
      LIMIT 1
    `).get() as Excerpt;

    if (!result) {
      res.status(404).json({ error: 'No excerpts found' });
      return;
    }

    if (lastExcerptId !== null && result.id === lastExcerptId) {
      const nextResult = await db.prepare(`
        SELECT id,
               book_title,
               book_excerpt,
               book_author,
               book_author_race,
               book_author_role
        FROM excerpts
        WHERE id > ?
        ORDER BY id ASC
        LIMIT 1
      `).get(lastExcerptId) as Excerpt;

      if (nextResult) {
        result = nextResult;
      } else {
        const prevResult = await db.prepare(`
          SELECT id,
                 book_title,
                 book_excerpt,
                 book_author,
                 book_author_race,
                 book_author_role
          FROM excerpts
          WHERE id < ?
          ORDER BY id DESC
          LIMIT 1
        `).get(lastExcerptId) as Excerpt;

        if (prevResult) {
          result = prevResult;
        } else {
          res.status(404).json({ error: 'No more excerpts found' });
          return;
        }
      }
    }

    lastExcerptId = result.id;
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch random excerpt' });
  }
});

export default router;