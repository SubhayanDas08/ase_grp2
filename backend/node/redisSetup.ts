import { pool } from './server';
import redisClient from './utils/redis'; 
import dotenv from 'dotenv';

dotenv.config();

async function syncPermissions() {
  try {
    console.log('Starting Permission Sync...');

    // Step 1: Query role-domain-permission mapping
    const query = `
      SELECT d.domain, p.name AS permission_name
      FROM domain_access d
      JOIN roles r ON d.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id;
    `;

    const result = await pool.query(query);
    console.log(result.rows,"result");
    

    // Step 2: Organize permissions per domain
    const domainPermissions: Record<string, Set<string>> = {};

    result.rows.forEach(row => {
      if (!domainPermissions[row.domain]) {
        domainPermissions[row.domain] = new Set();
      }
      domainPermissions[row.domain].add(row.permission_name);
    });

    // Step 3: Update Redis
    for (const [domain, permissions] of Object.entries(domainPermissions)) {
      const redisKey = `permissions:${domain}`;

      // Delete existing key to avoid duplication
      await redisClient.del(redisKey);

      // Add permissions to Redis SET
      if (permissions.size > 0) {
        await redisClient.sAdd(redisKey, [...permissions]);
        console.log(`Updated Redis key ${redisKey} with permissions: ${[...permissions]}`);
      }
    }

    console.log('Permission sync completed!');
    process.exit(0);

  } catch (error) {
    console.error('Error syncing permissions:', error);
    process.exit(1);
  }
}

syncPermissions();