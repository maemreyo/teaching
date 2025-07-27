#!/usr/bin/env node

/**
 * Batch Import Script for Multiple Units
 * Imports entire grade curriculum or specific unit ranges
 * 
 * Usage: 
 *   node import-multiple-units.js grade-6 --units 3,4,5,6
 *   node import-multiple-units.js grade-7 --all
 *   node import-multiple-units.js grade-6 --update-existing
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dudgwrozqlyzpnouqdot.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  section: (title) => console.log(`\n🔥 ${title}`)
};

class BatchImporter {
  constructor(grade, options = {}) {
    this.grade = grade;
    this.basePath = path.resolve(`../_resouces/english_global_success/${grade}`);
    this.options = options;
    this.stats = {
      totalUnits: 0,
      imported: 0,
      updated: 0,
      failed: 0,
      skipped: 0
    };
  }

  async discoverUnits() {
    try {
      const entries = await fs.readdir(this.basePath);
      const units = [];
      
      for (const entry of entries) {
        const unitPath = path.join(this.basePath, entry);
        const stat = await fs.stat(unitPath);
        
        if (stat.isDirectory() && /^\d+$/.test(entry)) {
          const jsonPath = path.join(unitPath, 'json');
          try {
            await fs.access(jsonPath);
            units.push(parseInt(entry));
          } catch {
            log.warning(`Unit ${entry} has no json directory, skipping`);
          }
        }
      }
      
      return units.sort((a, b) => a - b);
    } catch (error) {
      throw new Error(`Cannot discover units in ${this.basePath}: ${error.message}`);
    }
  }

  async getUnitsToImport() {
    const availableUnits = await this.discoverUnits();
    
    if (this.options.all) {
      return availableUnits;
    }
    
    if (this.options.units) {
      const requestedUnits = this.options.units.split(',').map(u => parseInt(u.trim()));
      const validUnits = requestedUnits.filter(u => availableUnits.includes(u));
      
      if (validUnits.length !== requestedUnits.length) {
        const invalid = requestedUnits.filter(u => !availableUnits.includes(u));
        log.warning(`Units not found: ${invalid.join(', ')}`);
      }
      
      return validUnits;
    }
    
    // Default: import all available units
    return availableUnits;
  }

  async checkExistingData(unitNumber) {
    const { data, error } = await supabase
      .from('units')
      .select('id, title, updated_at')
      .eq('unit_number', unitNumber)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  }

  async importUnit(unitNumber, mode = 'import') {
    const unitPath = path.join(this.basePath, unitNumber.toString());
    const importScript = path.join(__dirname, 'import-unit-data.js');
    
    try {
      log.info(`📦 ${mode === 'update' ? 'Updating' : 'Importing'} Unit ${unitNumber}...`);
      
      // Set environment variables for the subprocess
      const env = {
        ...process.env,
        NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_KEY
      };
      
      const dryRunFlag = this.options.dryRun ? '--dry-run' : '';
      const command = `node "${importScript}" "${unitPath}" ${dryRunFlag}`;
      
      const { stdout, stderr } = await execAsync(command, { env });
      
      if (stderr) {
        throw new Error(stderr);
      }
      
      // Parse the output to get statistics
      const lines = stdout.split('\n');
      const statsLine = lines.find(line => line.includes('Processed:'));
      if (statsLine) {
        log.info(`    ${statsLine.trim()}`);
      }
      
      if (mode === 'update') {
        this.stats.updated++;
      } else {
        this.stats.imported++;
      }
      
      log.success(`Unit ${unitNumber} ${mode === 'update' ? 'updated' : 'imported'} successfully`);
      
    } catch (error) {
      log.error(`Failed to ${mode === 'update' ? 'update' : 'import'} Unit ${unitNumber}: ${error.message}`);
      this.stats.failed++;
    }
  }

  async run() {
    try {
      log.section(`Batch Import for ${this.grade.toUpperCase()}`);
      log.info(`📁 Base Path: ${this.basePath}`);
      log.info(`🔧 Mode: ${this.options.dryRun ? 'DRY RUN' : 'LIVE IMPORT'}`);
      
      const unitsToImport = await this.getUnitsToImport();
      
      if (unitsToImport.length === 0) {
        log.warning('No units found to import');
        return;
      }
      
      this.stats.totalUnits = unitsToImport.length;
      log.info(`📚 Found ${unitsToImport.length} units to process: ${unitsToImport.join(', ')}`);
      
      for (const unitNumber of unitsToImport) {
        // Check if unit already exists
        const existingData = await this.checkExistingData(unitNumber);
        
        if (existingData && !this.options.updateExisting) {
          log.info(`📖 Unit ${unitNumber} already exists, skipping (use --update-existing to force update)`);
          this.stats.skipped++;
          continue;
        }
        
        const mode = existingData ? 'update' : 'import';
        await this.importUnit(unitNumber, mode);
        
        // Add delay between imports to avoid overwhelming the database
        if (!this.options.dryRun) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      this.showFinalStats();
      
    } catch (error) {
      log.error(`Batch import failed: ${error.message}`);
      throw error;
    }
  }

  showFinalStats() {
    log.section('Batch Import Summary');
    log.info(`📊 Total Units: ${this.stats.totalUnits}`);
    log.info(`✅ Imported: ${this.stats.imported}`);
    log.info(`🔄 Updated: ${this.stats.updated}`);
    log.info(`⏭️  Skipped: ${this.stats.skipped}`);
    log.info(`❌ Failed: ${this.stats.failed}`);
    
    if (this.options.dryRun) {
      log.warning('This was a DRY RUN - no data was actually imported');
    } else {
      log.success('🎉 Batch import completed!');
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const grade = args[0];
  
  if (!grade) {
    console.error(`
Usage: node import-multiple-units.js <grade> [options]

Examples:
  node import-multiple-units.js grade-6 --units 3,4,5,6
  node import-multiple-units.js grade-7 --all
  node import-multiple-units.js grade-6 --update-existing --dry-run

Options:
  --units <list>        Comma-separated list of unit numbers (e.g., 3,4,5,6)
  --all                 Import all available units in the grade
  --update-existing     Update units that already exist
  --dry-run, -d         Preview what would be imported without making changes

Grades:
  grade-6, grade-7, grade-8, grade-9, etc.
    `);
    process.exit(1);
  }

  const options = {
    units: args.find(arg => arg.startsWith('--units'))?.split('=')[1] || 
           (args.includes('--units') ? args[args.indexOf('--units') + 1] : null),
    all: args.includes('--all'),
    updateExisting: args.includes('--update-existing'),
    dryRun: args.includes('--dry-run') || args.includes('-d')
  };

  try {
    const importer = new BatchImporter(grade, options);
    await importer.run();
    process.exit(0);
  } catch (error) {
    log.error(`Batch import failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}