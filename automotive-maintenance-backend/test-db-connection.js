#!/usr/bin/env node

/**
 * Quick Database Connection Verification Script
 * Run: node test-db-connection.js
 */

require('dotenv').config();
const { Pool } = require('pg');

console.log('\n🔍 PostgreSQL Connection Test\n');
console.log('Configuration:');
console.log(`  Host:     ${process.env.DB_HOST || 'localhost'}`);
console.log(`  Port:     ${process.env.DB_PORT || 5432}`);
console.log(`  User:     ${process.env.DB_USER || 'postgres'}`);
console.log(`  Database: ${process.env.DB_NAME || 'automotive_maintenance'}`);
console.log('');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'automotive_maintenance',
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('Test 1: Basic Connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log(`   Current time: ${result.rows[0].now}\n`);

    // Test 2: Check tables
    console.log('Test 2: Checking Database Schema...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('⚠️  No tables found. Database schema needs initialization.\n');
    } else {
      console.log(`✅ Found ${tablesResult.rows.length} tables:`);
      tablesResult.rows.forEach(row => {
        console.log(`   • ${row.table_name}`);
      });
      console.log('');
    }

    // Test 3: Query sample data
    console.log('Test 3: Querying Sample Data...');
    try {
      const vehiclesResult = await pool.query('SELECT COUNT(*) as count FROM vehicles');
      const count = vehiclesResult.rows[0].count;
      console.log(`✅ Found ${count} vehicles in database\n`);
    } catch (e) {
      console.log('⚠️  Vehicles table not yet populated\n');
    }

    // Test 4: Pool stats
    console.log('Test 4: Connection Pool Status...');
    console.log(`✅ Pool ready`);
    console.log(`   Max connections: 5`);
    console.log(`   Idle clients: ${pool.idleCount}`);
    console.log(`   Waiting requests: ${pool.waitingCount}\n`);

    // Success
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ DATABASE CONNECTION SUCCESSFUL');
    console.log('═══════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ CONNECTION FAILED');
    console.error(`Error: ${error.message}\n`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('✗ PostgreSQL server is not running on the configured host/port');
      console.error('  Try: docker run --name automotive-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15\n');
    } else if (error.code === '28P01') {
      console.error('✗ Authentication failed - check DB_PASSWORD in .env file\n');
    } else if (error.code === '3D000') {
      console.error('✗ Database does not exist - check DB_NAME in .env file\n');
    }
  } finally {
    await pool.end();
  }
}

testConnection();
