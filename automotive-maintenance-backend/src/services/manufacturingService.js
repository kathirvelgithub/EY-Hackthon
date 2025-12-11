const pool = require('../config/database');

/**
 * Get RCA/CAPA records
 */
async function getRCACAPARecords() {
  try {
    const query = `SELECT * FROM rca_capa ORDER BY priority DESC, created_at DESC`;
    const result = await pool.query(query);
    return { records: result.rows };
  } catch (error) {
    throw error;
  }
}

/**
 * Get RCA/CAPA insights for a component type
 */
async function getInsightsForComponent(componentType) {
  try {
    const query = `
      SELECT * FROM rca_capa
      WHERE component_type ILIKE $1
      ORDER BY priority DESC
    `;
    const result = await pool.query(query, [`%${componentType}%`]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Analyze recurring defects
 */
async function analyzeRecurringDefects() {
  try {
    const query = `
      SELECT 
        component_type,
        COUNT(*) as occurrence_count,
        CASE 
          WHEN COUNT(*) > 5 THEN 'HIGH'
          WHEN COUNT(*) > 2 THEN 'MEDIUM'
          ELSE 'LOW'
        END as severity
      FROM rca_capa
      GROUP BY component_type
      ORDER BY occurrence_count DESC
    `;

    const result = await pool.query(query);
    return result.rows.map(row => ({
      component: row.component_type,
      occurrence_count: row.occurrence_count,
      severity: row.severity
    }));
  } catch (error) {
    throw error;
  }
}

/**
 * Get high priority RCA/CAPA items
 */
async function getHighPriorityItems() {
  try {
    const query = `
      SELECT * FROM rca_capa
      WHERE priority = 'HIGH' AND status != 'closed'
      ORDER BY target_completion ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRCACAPARecords,
  getInsightsForComponent,
  analyzeRecurringDefects,
  getHighPriorityItems
};
