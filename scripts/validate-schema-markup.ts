/**
 * Schema Markup Validation Script
 * 
 * This script validates the JSON-LD schema markup on cornerstone pages
 * to ensure they meet Google's Rich Results requirements.
 */

import * as fs from 'fs';
import * as path from 'path';

interface SchemaValidationResult {
  page: string;
  hasSchema: boolean;
  schemaType: string | null;
  requiredFields: {
    field: string;
    present: boolean;
    value?: any;
  }[];
  errors: string[];
  warnings: string[];
}

const cornerstonePages = [
  {
    path: 'src/app/resources/ai-marketing-plan-generator/page.tsx',
    name: 'AI Marketing Plan Generator',
    expectedType: 'Article',
  },
  {
    path: 'src/app/resources/marketing-strategy-template/page.tsx',
    name: 'Marketing Strategy Template',
    expectedType: 'Article',
  },
  {
    path: 'src/app/resources/marketing-kpi-dashboard/page.tsx',
    name: 'Marketing KPI Dashboard',
    expectedType: 'Article',
  },
  {
    path: 'src/app/resources/ai-for-agencies/page.tsx',
    name: 'AI for Agencies',
    expectedType: 'HowTo',
  },
  {
    path: 'src/app/resources/marketing-mix-modeling/page.tsx',
    name: 'Marketing Mix Modeling',
    expectedType: 'Article',
  },
];

const articleRequiredFields = [
  '@context',
  '@type',
  'headline',
  'description',
  'author',
  'publisher',
  'datePublished',
  'dateModified',
];

const howToRequiredFields = [
  '@context',
  '@type',
  'name',
  'description',
  'step',
];

function extractSchemaFromFile(filePath: string): any | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Look for JSON-LD schema in the file
    const schemaMatch = content.match(/const\s+\w*[Ss]chema\w*\s*=\s*({[\s\S]*?});/);
    
    if (!schemaMatch) {
      return null;
    }
    
    // Extract the schema object string
    const schemaStr = schemaMatch[1];
    
    // Try to parse it (this is a simplified approach)
    // In a real scenario, you'd want to use a proper JavaScript parser
    try {
      // Remove comments and clean up
      const cleanedSchema = schemaStr
        .replace(/\/\/.*/g, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
      
      // This is a simplified evaluation - in production, use a proper parser
      const schema = eval(`(${cleanedSchema})`);
      return schema;
    } catch (e) {
      console.error(`Error parsing schema in ${filePath}:`, e);
      return null;
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

function validateSchema(schema: any, expectedType: string): SchemaValidationResult['requiredFields'] {
  const requiredFields = expectedType === 'HowTo' ? howToRequiredFields : articleRequiredFields;
  
  return requiredFields.map(field => {
    const present = schema && schema[field] !== undefined && schema[field] !== null;
    return {
      field,
      present,
      value: present ? (typeof schema[field] === 'object' ? '[Object]' : schema[field]) : undefined,
    };
  });
}

function validatePage(pageInfo: typeof cornerstonePages[0]): SchemaValidationResult {
  const filePath = path.join(process.cwd(), pageInfo.path);
  const schema = extractSchemaFromFile(filePath);
  
  const result: SchemaValidationResult = {
    page: pageInfo.name,
    hasSchema: schema !== null,
    schemaType: schema?.['@type'] || null,
    requiredFields: [],
    errors: [],
    warnings: [],
  };
  
  if (!schema) {
    result.errors.push('No schema markup found in file');
    return result;
  }
  
  // Validate schema type
  if (schema['@type'] !== pageInfo.expectedType) {
    result.warnings.push(
      `Expected schema type "${pageInfo.expectedType}" but found "${schema['@type']}"`
    );
  }
  
  // Validate required fields
  result.requiredFields = validateSchema(schema, pageInfo.expectedType);
  
  // Check for missing required fields
  const missingFields = result.requiredFields.filter(f => !f.present);
  if (missingFields.length > 0) {
    result.errors.push(
      `Missing required fields: ${missingFields.map(f => f.field).join(', ')}`
    );
  }
  
  // Additional validations
  if (schema.headline && schema.headline.length > 110) {
    result.warnings.push(`Headline is ${schema.headline.length} characters (recommended: ≤110)`);
  }
  
  if (schema.description && schema.description.length > 160) {
    result.warnings.push(`Description is ${schema.description.length} characters (recommended: ≤160)`);
  }
  
  return result;
}

function printResults(results: SchemaValidationResult[]) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 SCHEMA MARKUP VALIDATION RESULTS');
  console.log('='.repeat(80) + '\n');
  
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.page}`);
    console.log('─'.repeat(80));
    
    if (result.hasSchema) {
      console.log(`✅ Schema Found: ${result.schemaType}`);
      
      console.log('\n   Required Fields:');
      result.requiredFields.forEach(field => {
        const status = field.present ? '✅' : '❌';
        const value = field.value ? ` = ${field.value}` : '';
        console.log(`   ${status} ${field.field}${value}`);
      });
      
      if (result.errors.length > 0) {
        console.log('\n   ❌ Errors:');
        result.errors.forEach(error => console.log(`      • ${error}`));
      }
      
      if (result.warnings.length > 0) {
        console.log('\n   ⚠️  Warnings:');
        result.warnings.forEach(warning => console.log(`      • ${warning}`));
      }
      
      if (result.errors.length === 0 && result.warnings.length === 0) {
        console.log('\n   ✅ All validations passed!');
      }
    } else {
      console.log('❌ No schema markup found');
      result.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    console.log('');
  });
  
  // Summary
  const totalPages = results.length;
  const pagesWithSchema = results.filter(r => r.hasSchema).length;
  const pagesWithErrors = results.filter(r => r.errors.length > 0).length;
  const pagesWithWarnings = results.filter(r => r.warnings.length > 0).length;
  
  console.log('='.repeat(80));
  console.log('📈 SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Pages: ${totalPages}`);
  console.log(`Pages with Schema: ${pagesWithSchema}/${totalPages}`);
  console.log(`Pages with Errors: ${pagesWithErrors}`);
  console.log(`Pages with Warnings: ${pagesWithWarnings}`);
  console.log('='.repeat(80) + '\n');
  
  if (pagesWithErrors === 0) {
    console.log('✅ All pages have valid schema markup!\n');
  } else {
    console.log('❌ Some pages have schema validation errors. Please fix them.\n');
  }
}

// Run validation
console.log('🔍 Validating schema markup for cornerstone pages...\n');

const results = cornerstonePages.map(validatePage);
printResults(results);

