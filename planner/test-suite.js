#!/usr/bin/env node

/**
 * Circular Daily Planner - Automated Test Suite
 * Runs comprehensive tests for the planner application
 */

const fs = require('fs');
const path = require('path');

class PlannerTestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      issues: []
    };
    this.startTime = Date.now();
  }

  // Test runner
  async runTests() {
    console.log('🧪 Circular Daily Planner - Test Suite');
    console.log('=====================================\n');

    // File structure tests
    await this.testFileStructure();
    
    // Build process tests
    await this.testBuildProcess();
    
    // Content validation tests
    await this.testContentValidation();
    
    // Performance tests
    await this.testPerformance();
    
    // Security tests
    await this.testSecurity();
    
    // Generate report
    this.generateReport();
  }

  // Test file structure
  async testFileStructure() {
    console.log('📁 Testing File Structure...');
    
    const requiredFiles = [
      'index.html',
      'index.prod.html',
      'css/themes.css',
      'css/planner.css',
      'js/form-handler.js',
      'js/planner.js',
      'js/canvas-export.js',
      'dist/planner.min.css',
      'dist/planner.min.js',
      'assets/og-image.svg',
      'README.md',
      'robots.txt'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        this.pass(`File exists: ${file}`);
      } else {
        this.fail(`Missing file: ${file}`);
      }
    }
  }

  // Test build process
  async testBuildProcess() {
    console.log('\n🔨 Testing Build Process...');
    
    // Check if dist files exist
    const distFiles = ['dist/planner.min.css', 'dist/planner.min.js'];
    for (const file of distFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        this.pass(`Build file exists: ${file} (${sizeKB}KB)`);
        
        // Check bundle size limits
        if (file.includes('.css') && sizeKB > 50) {
          this.fail(`CSS bundle too large: ${sizeKB}KB (limit: 50KB)`);
        } else if (file.includes('.js') && sizeKB > 100) {
          this.fail(`JS bundle too large: ${sizeKB}KB (limit: 100KB)`);
        }
      } else {
        this.fail(`Missing build file: ${file}`);
      }
    }

    // Check total bundle size
    let totalSize = 0;
    for (const file of distFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }
    }
    
    const totalSizeKB = Math.round(totalSize / 1024);
    if (totalSizeKB <= 150) {
      this.pass(`Total bundle size: ${totalSizeKB}KB (under 150KB limit)`);
    } else {
      this.fail(`Total bundle size too large: ${totalSizeKB}KB (limit: 150KB)`);
    }
  }

  // Test content validation
  async testContentValidation() {
    console.log('\n📝 Testing Content Validation...');
    
    // Test HTML files
    const htmlFiles = ['index.html', 'index.prod.html'];
    for (const file of htmlFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for required meta tags
        const requiredMetaTags = [
          'og:title',
          'og:description',
          'og:image',
          'twitter:card',
          'twitter:title',
          'twitter:description',
          'twitter:image'
        ];
        
        for (const tag of requiredMetaTags) {
          if (content.includes(tag)) {
            this.pass(`Meta tag found in ${file}: ${tag}`);
          } else {
            this.fail(`Missing meta tag in ${file}: ${tag}`);
          }
        }
        
        // Check for Schema.org markup
        if (content.includes('application/ld+json')) {
          this.pass(`Schema.org markup found in ${file}`);
        } else {
          this.fail(`Missing Schema.org markup in ${file}`);
        }
        
        // Check for accessibility attributes
        const accessibilityAttrs = [
          'aria-label',
          'role=',
          'aria-live',
          'aria-describedby'
        ];
        
        let accessibilityScore = 0;
        for (const attr of accessibilityAttrs) {
          if (content.includes(attr)) {
            accessibilityScore++;
          }
        }
        
        if (accessibilityScore >= 3) {
          this.pass(`Good accessibility attributes in ${file} (${accessibilityScore}/4)`);
        } else {
          this.fail(`Poor accessibility attributes in ${file} (${accessibilityScore}/4)`);
        }
      }
    }
  }

  // Test performance
  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    // Check for performance optimizations
    const htmlFiles = ['index.html', 'index.prod.html'];
    for (const file of htmlFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for preloading
        if (content.includes('rel="preload"')) {
          this.pass(`Resource preloading found in ${file}`);
        } else {
          this.fail(`Missing resource preloading in ${file}`);
        }
        
        // Check for deferred scripts
        if (content.includes('defer')) {
          this.pass(`Deferred script loading found in ${file}`);
        } else {
          this.fail(`Missing deferred script loading in ${file}`);
        }
        
        // Check for minified resources in production
        if (file.includes('prod') && content.includes('planner.min.')) {
          this.pass(`Minified resources used in ${file}`);
        } else if (file.includes('prod')) {
          this.fail(`Non-minified resources in production file ${file}`);
        }
      }
    }
  }

  // Test security
  async testSecurity() {
    console.log('\n🔒 Testing Security...');
    
    const htmlFiles = ['index.html', 'index.prod.html'];
    for (const file of htmlFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for CSP
        if (content.includes('Content-Security-Policy')) {
          this.pass(`Content Security Policy found in ${file}`);
          
          // Check for unsafe directives
          if (content.includes('unsafe-inline') || content.includes('unsafe-eval')) {
            this.fail(`Unsafe CSP directives found in ${file}`);
          } else {
            this.pass(`Secure CSP configuration in ${file}`);
          }
        } else {
          this.fail(`Missing Content Security Policy in ${file}`);
        }
        
        // Check for security headers
        const securityHeaders = [
          'X-Frame-Options',
          'X-Content-Type-Options',
          'Referrer-Policy'
        ];
        
        for (const header of securityHeaders) {
          if (content.includes(header)) {
            this.pass(`Security header found in ${file}: ${header}`);
          } else {
            this.fail(`Missing security header in ${file}: ${header}`);
          }
        }
      }
    }
  }

  // Test result tracking
  pass(message) {
    this.results.passed++;
    this.results.total++;
    console.log(`  ✅ ${message}`);
  }

  fail(message) {
    this.results.failed++;
    this.results.total++;
    this.results.issues.push(message);
    console.log(`  ❌ ${message}`);
  }

  // Generate test report
  generateReport() {
    const endTime = Date.now();
    const duration = Math.round((endTime - this.startTime) / 1000);
    
    console.log('\n📊 Test Results Summary');
    console.log('======================');
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${Math.round((this.results.passed / this.results.total) * 100)}%`);
    console.log(`Duration: ${duration}s`);
    
    if (this.results.issues.length > 0) {
      console.log('\n🚨 Issues Found:');
      this.results.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All tests passed! Ready for deployment.');
    } else {
      console.log('\n⚠️  Some tests failed. Please address issues before deployment.');
    }
    
    // Save results to file
    const reportPath = path.join(__dirname, 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      duration: duration,
      results: this.results
    }, null, 2));
    
    console.log(`\n📄 Detailed results saved to: test-results.json`);
  }
}

// Run tests if called directly
if (require.main === module) {
  const testSuite = new PlannerTestSuite();
  testSuite.runTests().catch(console.error);
}

module.exports = PlannerTestSuite;
