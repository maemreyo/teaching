#!/usr/bin/env node

/**
 * Curriculum Update Script
 * Handles updates to existing curriculum data with smart change detection
 * 
 * Usage:
 *   node update-curriculum.js grade-6/2 --check-changes
 *   node update-curriculum.js grade-6/2 --force-update
 *   node update-curriculum.js grade-6 --update-all-units
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  section: (title) => console.log(`\n🔥 ${title}`),
  change: (msg) => console.log(`🔄 ${msg}`)
};

class CurriculumUpdater {
  constructor(unitPath, options = {}) {
    this.unitPath = path.resolve(unitPath);
    this.jsonPath = path.join(this.unitPath, 'json');
    this.options = options;
    this.changes = {
      added: [],
      modified: [],
      removed: [],
      unchanged: []
    };
  }

  async generateContentHash(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return crypto.createHash('md5').update(content).digest('hex');
    } catch (error) {
      return null;
    }
  }

  async getStoredHashes(unitId) {
    const { data, error } = await supabase
      .from('content_hashes')
      .select('file_path, hash, last_updated')
      .eq('unit_id', unitId);

    if (error && error.code !== 'PGRST116') {
      // Table might not exist yet, create it
      await this.createHashTable();
      return {};
    }

    return (data || []).reduce((acc, item) => {
      acc[item.file_path] = item;
      return acc;
    }, {});
  }

  async createHashTable() {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS content_hashes (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
          file_path TEXT NOT NULL,
          hash TEXT NOT NULL,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(unit_id, file_path)
        );
        CREATE INDEX IF NOT EXISTS idx_content_hashes_unit_id ON content_hashes(unit_id);
      `
    });

    if (error) {
      log.warning('Could not create content_hashes table, proceeding without change detection');
    }
  }

  async detectChanges() {
    log.section('Change Detection');
    
    // Get unit ID first
    const unitNumber = parseInt(path.basename(this.unitPath));
    const { data: unit } = await supabase
      .from('units')
      .select('id')
      .eq('unit_number', unitNumber)
      .single();

    if (!unit) {
      log.info('Unit not found in database, treating as new import');
      return { hasChanges: true, isNew: true };
    }

    const storedHashes = await this.getStoredHashes(unit.id);
    const files = await fs.readdir(this.jsonPath);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    for (const file of jsonFiles) {
      const filePath = path.join(this.jsonPath, file);
      const currentHash = await this.generateContentHash(filePath);
      const storedHash = storedHashes[file];

      if (!storedHash) {
        this.changes.added.push({ file, hash: currentHash });
        log.change(`➕ New file: ${file}`);
      } else if (storedHash.hash !== currentHash) {
        this.changes.modified.push({ 
          file, 
          oldHash: storedHash.hash, 
          newHash: currentHash,
          lastUpdated: storedHash.last_updated
        });
        log.change(`📝 Modified: ${file} (last updated: ${storedHash.last_updated})`);
      } else {
        this.changes.unchanged.push({ file, hash: currentHash });
      }
    }

    // Check for removed files
    const currentFiles = new Set(jsonFiles);
    Object.keys(storedHashes).forEach(file => {
      if (!currentFiles.has(file)) {
        this.changes.removed.push({ file, hash: storedHashes[file].hash });
        log.change(`🗑️  Removed: ${file}`);
      }
    });

    const hasChanges = this.changes.added.length > 0 || 
                      this.changes.modified.length > 0 || 
                      this.changes.removed.length > 0;

    if (!hasChanges) {
      log.success('No changes detected');
    } else {
      log.info(`Changes detected: ${this.changes.added.length} added, ${this.changes.modified.length} modified, ${this.changes.removed.length} removed`);
    }

    return { hasChanges, isNew: false, unitId: unit.id };
  }

  async updateHashes(unitId) {
    const files = await fs.readdir(this.jsonPath);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    for (const file of jsonFiles) {
      const filePath = path.join(this.jsonPath, file);
      const hash = await this.generateContentHash(filePath);

      await supabase
        .from('content_hashes')
        .upsert({
          unit_id: unitId,
          file_path: file,
          hash: hash
        }, { onConflict: 'unit_id,file_path' });
    }

    // Remove hashes for files that no longer exist
    const currentFiles = new Set(jsonFiles);
    for (const removedFile of this.changes.removed) {
      await supabase
        .from('content_hashes')
        .delete()
        .eq('unit_id', unitId)
        .eq('file_path', removedFile.file);
    }
  }

  async runImport() {
    log.section('Running Import');
    
    // Use the existing import script
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    const importScript = path.join(__dirname, 'import-unit-data.js');
    const env = {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_KEY
    };

    const dryRunFlag = this.options.dryRun ? '--dry-run' : '';
    const command = `node "${importScript}" "${this.unitPath}" ${dryRunFlag}`;

    try {
      const { stdout, stderr } = await execAsync(command, { env });
      
      if (stderr) {
        throw new Error(stderr);
      }
      
      log.success('Import completed successfully');
      return true;
    } catch (error) {
      log.error(`Import failed: ${error.message}`);
      return false;
    }
  }

  async update() {
    try {
      log.section(`Curriculum Update for ${path.basename(this.unitPath)}`);
      log.info(`📁 Unit Path: ${this.unitPath}`);
      log.info(`🔧 Mode: ${this.options.dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);

      // Detect changes
      const { hasChanges, isNew, unitId } = await this.detectChanges();

      if (!hasChanges && !this.options.forceUpdate) {
        log.success('✨ Content is up to date, no import needed');
        return;
      }

      if (this.options.checkOnly) {
        log.info('📋 Check-only mode, exiting after change detection');
        return;
      }

      // Run import
      const importSuccess = await this.runImport();

      if (importSuccess && !this.options.dryRun && unitId) {
        await this.updateHashes(unitId);
        log.success('📝 Content hashes updated');
      }

      log.success('🎉 Update completed successfully');

    } catch (error) {
      log.error(`Update failed: ${error.message}`);
      throw error;
    }
  }

  showChangeSummary() {
    if (this.changes.added.length === 0 && 
        this.changes.modified.length === 0 && 
        this.changes.removed.length === 0) {
      log.success('No changes detected');
      return;
    }

    log.section('Change Summary');
    
    if (this.changes.added.length > 0) {
      log.info(`➕ Added files (${this.changes.added.length}):`);
      this.changes.added.forEach(item => log.info(`   ${item.file}`));
    }

    if (this.changes.modified.length > 0) {
      log.info(`📝 Modified files (${this.changes.modified.length}):`);
      this.changes.modified.forEach(item => log.info(`   ${item.file}`));
    }

    if (this.changes.removed.length > 0) {
      log.info(`🗑️  Removed files (${this.changes.removed.length}):`);
      this.changes.removed.forEach(item => log.info(`   ${item.file}`));
    }

    if (this.changes.unchanged.length > 0) {
      log.info(`✅ Unchanged files (${this.changes.unchanged.length}):`);
      this.changes.unchanged.forEach(item => log.info(`   ${item.file}`));
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const unitPath = args[0];

  if (!unitPath) {
    console.error(`
Usage: node update-curriculum.js <unit-path> [options]

Examples:
  node update-curriculum.js "_resouces/english_global_success/grade-6/2" --check-changes
  node update-curriculum.js "_resouces/english_global_success/grade-6/3" --force-update
  node update-curriculum.js "_resouces/english_global_success/grade-6/4" --dry-run

Options:
  --check-changes, --check    Only check for changes, don't import
  --force-update, --force     Force update even if no changes detected
  --dry-run, -d               Preview what would be updated without making changes

Features:
  ✅ Smart change detection using file hashes
  ✅ Only imports when content actually changes
  ✅ Tracks last update timestamps
  ✅ Safe to run repeatedly
    `);
    process.exit(1);
  }

  const options = {
    checkOnly: args.includes('--check-changes') || args.includes('--check'),
    forceUpdate: args.includes('--force-update') || args.includes('--force'),
    dryRun: args.includes('--dry-run') || args.includes('-d')
  };

  try {
    const updater = new CurriculumUpdater(unitPath, options);
    await updater.update();
    updater.showChangeSummary();
    process.exit(0);
  } catch (error) {
    log.error(`Update failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}