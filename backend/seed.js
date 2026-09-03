import bcrypt from 'bcryptjs';
import { pool, query } from './src/config/db.js';
import env from './src/config/env.js';

async function seedDatabase() {
  console.log('=================================================');
  console.log('🌱 ProjectPulse Database Seeding Tool');
  console.log(`📡 Connecting to: "${env.DATABASE_URL ? env.DATABASE_URL.split('@')[1] || 'configured host' : 'NOT SET'}"`);
  console.log('=================================================');

  if (!env.DATABASE_URL) {
    console.log('⚠️ NOTICE: DATABASE_URL is not set in backend/.env.');
    console.log('👉 Please add your Render PostgreSQL connection string to backend/.env as DATABASE_URL=...');
    console.log('=================================================');
    return;
  }

  try {
    // 1. Seed Users (default password for all seed accounts: "password123")
    const defaultPasswordHash = await bcrypt.hash('password123', 10);

    const users = [
      { id: 'a1b2c3d4-0001-4000-8000-000000000001', full_name: 'Alex Rivera', email: 'alex.rivera@projectpulse.io', role: 'admin' },
      { id: 'a1b2c3d4-0002-4000-8000-000000000002', full_name: 'Sarah Jenkins', email: 'sarah.j@projectpulse.io', role: 'team_leader' },
      { id: 'a1b2c3d4-0003-4000-8000-000000000003', full_name: 'David Chen', email: 'david.c@projectpulse.io', role: 'employee' }
    ];

    for (const u of users) {
      await query(
        `INSERT INTO users (id, full_name, email, role, password_hash)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role`,
        [u.id, u.full_name, u.email, u.role, defaultPasswordHash]
      );
    }
    console.log('✅ Users table seeded successfully (3 test accounts created, password: password123).');

    // 2. Seed Projects
    const projects = [
      {
        id: 'b1b2c3d4-0001-4000-8000-000000000001',
        name: 'Enterprise Cloud Migration',
        description: 'Migrating legacy monolith architecture to microservices on AWS with Zero-Downtime deployment.',
        start_date: '2026-08-01',
        deadline: '2026-10-15',
        status: 'on_track',
        created_by: users[0].id
      },
      {
        id: 'b1b2c3d4-0002-4000-8000-000000000002',
        name: 'AI Deadline Analytics Engine',
        description: 'Backend prediction algorithms consuming GitHub commit velocity & historical sprint throughput.',
        start_date: '2026-08-01',
        deadline: '2026-09-30',
        status: 'delayed',
        created_by: users[0].id
      }
    ];

    for (const p of projects) {
      await query(
        `INSERT INTO projects (id, name, description, start_date, deadline, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status`,
        [p.id, p.name, p.description, p.start_date, p.deadline, p.status, p.created_by]
      );
    }
    console.log('✅ Projects table seeded successfully (2 active project sprints created).');

    // 3. Seed Tasks
    const tasks = [
      {
        id: 'c1b2c3d4-0001-4000-8000-000000000001',
        project_id: projects[0].id,
        title: 'Configure Automated CI/CD Pipeline on GitHub Actions',
        description: 'Build workflow triggers on main branch push to run test suites and deploys to Staging.',
        assigned_to: users[2].id,
        status: 'completed',
        progress_percent: 100,
        priority: 'high',
        planned_start: '2026-08-01',
        planned_end: '2026-08-10'
      },
      {
        id: 'c1b2c3d4-0002-4000-8000-000000000002',
        project_id: projects[1].id,
        title: 'Train Historical Deadline Prediction Model',
        description: 'Train XGBoost regression model using historical pull request review duration and task story points.',
        assigned_to: users[1].id,
        status: 'blocked',
        progress_percent: 40,
        priority: 'high',
        planned_start: '2026-08-12',
        planned_end: '2026-09-05'
      }
    ];

    for (const t of tasks) {
      await query(
        `INSERT INTO tasks (id, project_id, title, description, assigned_to, status, progress_percent, priority, planned_start, planned_end)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, progress_percent = EXCLUDED.progress_percent`,
        [t.id, t.project_id, t.title, t.description, t.assigned_to, t.status, t.progress_percent, t.priority, t.planned_start, t.planned_end]
      );
    }
    console.log('✅ Tasks table seeded successfully.');

    console.log('=================================================');
    console.log('🎉 Seed execution finished!');
    console.log('=================================================');
  } catch (err) {
    console.error('❌ Unexpected Seed Error:', err.message || err);
  } finally {
    await pool.end();
  }
}

seedDatabase();
