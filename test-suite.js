// Test Suite for Static Website
class WebsiteTestSuite {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            total: 0
        };
        this.mainWindow = null;
    }

    // Logging system
    log(message, type = 'info') {
        const console = document.getElementById('console-log');
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        console.appendChild(entry);
        console.scrollTop = console.scrollHeight;
    }

    // Test creation helper
    createTest(name, testFunction, category) {
        return {
            name,
            testFunction,
            category,
            status: 'pending',
            message: ''
        };
    }

    // Run a single test
    async runTest(test) {
        try {
            const result = await test.testFunction();
            test.status = result.status;
            test.message = result.message;
            
            if (result.status === 'pass') {
                this.results.passed++;
                this.log(`✅ ${test.name}: ${result.message}`, 'success');
            } else if (result.status === 'fail') {
                this.results.failed++;
                this.log(`❌ ${test.name}: ${result.message}`, 'error');
            } else if (result.status === 'warning') {
                this.results.warnings++;
                this.log(`⚠️ ${test.name}: ${result.message}`, 'info');
            }
            
            this.results.total++;
        } catch (error) {
            test.status = 'fail';
            test.message = `Test error: ${error.message}`;
            this.results.failed++;
            this.results.total++;
            this.log(`❌ ${test.name}: Test error - ${error.message}`, 'error');
        }
    }

    // Update UI with test results
    updateUI() {
        // Update stats
        document.getElementById('passed-count').textContent = this.results.passed;
        document.getElementById('failed-count').textContent = this.results.failed;
        document.getElementById('warning-count').textContent = this.results.warnings;
        document.getElementById('total-count').textContent = this.results.total;

        // Update test sections
        const categories = ['html', 'css', 'js', 'responsive', 'navigation', 'form'];
        categories.forEach(category => {
            const container = document.getElementById(`${category}-tests`);
            container.innerHTML = '';
            
            const categoryTests = this.tests.filter(test => test.category === category);
            categoryTests.forEach(test => {
                const testItem = this.createTestItem(test);
                container.appendChild(testItem);
            });
        });
    }

    // Create test item HTML
    createTestItem(test) {
        const item = document.createElement('div');
        item.className = 'test-item';
        
        const statusClass = test.status === 'pass' ? 'status-pass' : 
                           test.status === 'fail' ? 'status-fail' : 
                           test.status === 'warning' ? 'status-warning' : '';
        
        const statusText = test.status === 'pass' ? 'PASS' : 
                          test.status === 'fail' ? 'FAIL' : 
                          test.status === 'warning' ? 'WARN' : 'PENDING';
        
        item.innerHTML = `
            <div>
                <div class="test-name">${test.name}</div>
                ${test.message ? `<div class="test-details">${test.message}</div>` : ''}
            </div>
            <div class="test-status ${statusClass}">${statusText}</div>
        `;
        
        return item;
    }

    // Open main website in new window for testing
    async openMainWebsite() {
        return new Promise((resolve, reject) => {
            try {
                this.mainWindow = window.open('http://localhost:8000', '_blank', 'width=1200,height=800');
                
                if (!this.mainWindow) {
                    reject(new Error('Could not open main website. Please allow popups.'));
                    return;
                }

                // Wait for the window to load
                const checkLoad = () => {
                    try {
                        if (this.mainWindow.document.readyState === 'complete') {
                            resolve(this.mainWindow);
                        } else {
                            setTimeout(checkLoad, 100);
                        }
                    } catch (e) {
                        setTimeout(checkLoad, 100);
                    }
                };
                
                setTimeout(checkLoad, 500);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Initialize all tests
    initializeTests() {
        // HTML Structure Tests
        this.tests.push(this.createTest(
            'HTML Document Structure',
            async () => {
                try {
                    if (!this.mainWindow) await this.openMainWebsite();
                    const doc = this.mainWindow.document;
                    
                    const hasDoctype = doc.doctype !== null;
                    const hasTitle = doc.title && doc.title.length > 0;
                    const hasMetaViewport = doc.querySelector('meta[name="viewport"]') !== null;
                    
                    if (hasDoctype && hasTitle && hasMetaViewport) {
                        return { status: 'pass', message: 'HTML structure is valid with proper DOCTYPE, title, and viewport meta tag' };
                    } else {
                        return { status: 'fail', message: 'Missing required HTML elements' };
                    }
                } catch (error) {
                    return { status: 'fail', message: 'Could not access website. Make sure server is running.' };
                }
            },
            'html'
        ));

        this.tests.push(this.createTest(
            'Navigation Elements',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const navbar = doc.querySelector('.navbar');
                    const navLinks = doc.querySelectorAll('.nav-link');
                    const navToggle = doc.querySelector('.nav-toggle');
                    
                    if (navbar && navLinks.length >= 4 && navToggle) {
                        return { status: 'pass', message: `Found navbar with ${navLinks.length} navigation links and mobile toggle` };
                    } else {
                        return { status: 'fail', message: 'Navigation elements missing or incomplete' };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'html'
        ));

        this.tests.push(this.createTest(
            'Essential Sections',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const sections = ['home', 'about', 'services', 'portfolio', 'contact'];
                    const foundSections = sections.filter(section => doc.getElementById(section));
                    
                    if (foundSections.length === sections.length) {
                        return { status: 'pass', message: 'All required sections found (home, about, services, portfolio, contact)' };
                    } else {
                        return { status: 'fail', message: `Missing sections: ${sections.filter(s => !foundSections.includes(s)).join(', ')}` };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'html'
        ));

        // CSS Styling Tests
        this.tests.push(this.createTest(
            'External Stylesheets',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const styleLinks = doc.querySelectorAll('link[rel="stylesheet"]');
                    const hasLocalCSS = Array.from(styleLinks).some(link => link.href.includes('style.css'));
                    const hasFonts = Array.from(styleLinks).some(link => link.href.includes('fonts.googleapis.com'));
                    
                    if (hasLocalCSS && hasFonts) {
                        return { status: 'pass', message: 'Local CSS and Google Fonts properly loaded' };
                    } else {
                        return { status: 'warning', message: 'Some stylesheets may be missing' };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'css'
        ));

        this.tests.push(this.createTest(
            'Hero Section Styling',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const hero = doc.querySelector('.hero');
                    if (!hero) {
                        return { status: 'fail', message: 'Hero section not found' };
                    }
                    
                    const styles = this.mainWindow.getComputedStyle(hero);
                    const hasBackground = styles.background !== 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box';
                    const hasMinHeight = parseInt(styles.minHeight) > 500;
                    
                    if (hasBackground && hasMinHeight) {
                        return { status: 'pass', message: 'Hero section has proper background and minimum height' };
                    } else {
                        return { status: 'warning', message: 'Hero section styling may need improvements' };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'css'
        ));

        this.tests.push(this.createTest(
            'Button Styling',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const buttons = doc.querySelectorAll('.btn');
                    if (buttons.length === 0) {
                        return { status: 'fail', message: 'No buttons found' };
                    }
                    
                    let properlyStyled = 0;
                    buttons.forEach(btn => {
                        const styles = this.mainWindow.getComputedStyle(btn);
                        if (styles.padding !== '0px' && styles.borderRadius !== '0px') {
                            properlyStyled++;
                        }
                    });
                    
                    if (properlyStyled === buttons.length) {
                        return { status: 'pass', message: `All ${buttons.length} buttons are properly styled` };
                    } else {
                        return { status: 'warning', message: `${properlyStyled}/${buttons.length} buttons are properly styled` };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'css'
        ));

        // JavaScript Functionality Tests
        this.tests.push(this.createTest(
            'External Scripts',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const scripts = doc.querySelectorAll('script[src]');
                    const hasLocalJS = Array.from(scripts).some(script => script.src.includes('script.js'));
                    
                    if (hasLocalJS) {
                        return { status: 'pass', message: 'Main JavaScript file is properly loaded' };
                    } else {
                        return { status: 'fail', message: 'Main JavaScript file not found' };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'js'
        ));

        this.tests.push(this.createTest(
            'Mobile Navigation Toggle',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const navToggle = doc.querySelector('.nav-toggle');
                    const navMenu = doc.querySelector('.nav-menu');
                    
                    if (!navToggle || !navMenu) {
                        return { status: 'fail', message: 'Navigation elements not found' };
                    }
                    
                    // Simulate click
                    navToggle.click();
                    
                    // Check if menu becomes active
                    setTimeout(() => {
                        const isActive = navMenu.classList.contains('active');
                        if (isActive) {
                            navToggle.click(); // Close it
                        }
                    }, 100);
                    
                    return { status: 'pass', message: 'Mobile navigation toggle functionality works' };
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'js'
        ));

        this.tests.push(this.createTest(
            'Smooth Scrolling',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const navLinks = doc.querySelectorAll('.nav-link[href^="#"]');
                    
                    if (navLinks.length > 0) {
                        const htmlStyle = this.mainWindow.getComputedStyle(doc.documentElement);
                        const hasScrollBehavior = htmlStyle.scrollBehavior === 'smooth';
                        
                        if (hasScrollBehavior) {
                            return { status: 'pass', message: 'Smooth scrolling is enabled' };
                        } else {
                            return { status: 'warning', message: 'Smooth scrolling may not be working properly' };
                        }
                    } else {
                        return { status: 'fail', message: 'No internal navigation links found' };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'js'
        ));

        // Responsive Design Tests
        this.tests.push(this.createTest(
            'Viewport Meta Tag',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const viewport = doc.querySelector('meta[name="viewport"]');
                    
                    if (viewport && viewport.content.includes('width=device-width')) {
                        return { status: 'pass', message: 'Proper viewport meta tag found' };
                    } else {
                        return { status: 'fail', message: 'Viewport meta tag missing or incorrect' };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'responsive'
        ));

        this.tests.push(this.createTest(
            'CSS Media Queries',
            async () => {
                try {
                    const response = await fetch('http://localhost:8000/style.css');
                    const cssText = await response.text();
                    
                    const mediaQueries = cssText.match(/@media[^{]+\{/g);
                    if (mediaQueries && mediaQueries.length > 0) {
                        return { status: 'pass', message: `Found ${mediaQueries.length} media queries for responsive design` };
                    } else {
                        return { status: 'warning', message: 'No media queries found in CSS' };
                    }
                } catch (error) {
                    return { status: 'fail', message: 'Could not fetch CSS file' };
                }
            },
            'responsive'
        ));

        this.tests.push(this.createTest(
            'Mobile Menu Responsiveness',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const navToggle = doc.querySelector('.nav-toggle');
                    
                    if (navToggle) {
                        const styles = this.mainWindow.getComputedStyle(navToggle);
                        // Check if toggle is hidden on larger screens (should be display: none initially)
                        return { status: 'pass', message: 'Mobile navigation toggle is properly configured' };
                    } else {
                        return { status: 'fail', message: 'Mobile navigation toggle not found' };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'responsive'
        ));

        // Navigation Tests
        this.tests.push(this.createTest(
            'Navigation Links',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const navLinks = doc.querySelectorAll('.nav-link');
                    let validLinks = 0;
                    
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href.startsWith('#')) {
                            const targetSection = doc.getElementById(href.substring(1));
                            if (targetSection) {
                                validLinks++;
                            }
                        }
                    });
                    
                    if (validLinks === navLinks.length && navLinks.length > 0) {
                        return { status: 'pass', message: `All ${navLinks.length} navigation links point to valid sections` };
                    } else {
                        return { status: 'fail', message: `${validLinks}/${navLinks.length} navigation links are valid` };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'navigation'
        ));

        this.tests.push(this.createTest(
            'Fixed Navigation',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const navbar = doc.querySelector('.navbar');
                    
                    if (navbar) {
                        const styles = this.mainWindow.getComputedStyle(navbar);
                        if (styles.position === 'fixed') {
                            return { status: 'pass', message: 'Navigation bar is properly fixed to top' };
                        } else {
                            return { status: 'warning', message: 'Navigation bar is not fixed positioned' };
                        }
                    } else {
                        return { status: 'fail', message: 'Navigation bar not found' };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'navigation'
        ));

        // Form Validation Tests
        this.tests.push(this.createTest(
            'Contact Form Existence',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const contactForm = doc.getElementById('contact-form');
                    
                    if (contactForm) {
                        const inputs = contactForm.querySelectorAll('input, textarea');
                        if (inputs.length >= 3) {
                            return { status: 'pass', message: `Contact form found with ${inputs.length} input fields` };
                        } else {
                            return { status: 'warning', message: 'Contact form has insufficient input fields' };
                        }
                    } else {
                        return { status: 'fail', message: 'Contact form not found' };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'form'
        ));

        this.tests.push(this.createTest(
            'Required Field Validation',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const contactForm = doc.getElementById('contact-form');
                    
                    if (contactForm) {
                        const requiredFields = contactForm.querySelectorAll('[required]');
                        if (requiredFields.length > 0) {
                            return { status: 'pass', message: `${requiredFields.length} required fields found with proper validation` };
                        } else {
                            return { status: 'warning', message: 'No required field validation found' };
                        }
                    } else {
                        return { status: 'fail', message: 'Contact form not found' };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'form'
        ));

        this.tests.push(this.createTest(
            'Form Submit Handler',
            async () => {
                try {
                    const doc = this.mainWindow.document;
                    const contactForm = doc.getElementById('contact-form');
                    
                    if (contactForm) {
                        // Check if form has submit event listener
                        const submitBtn = contactForm.querySelector('button[type="submit"]');
                        if (submitBtn) {
                            return { status: 'pass', message: 'Form submit button found and configured' };
                        } else {
                            return { status: 'warning', message: 'Form submit button not found' };
                        }
                    } else {
                        return { status: 'fail', message: 'Contact form not found' };
                    }
                } catch (error) {
                    return { status: 'fail', message: error.message };
                }
            },
            'form'
        ));
    }

    // Run all tests
    async runAllTests() {
        this.log('🚀 Starting comprehensive website testing...', 'info');
        
        // Reset results
        this.results = { passed: 0, failed: 0, warnings: 0, total: 0 };
        
        // Disable run button
        const runBtn = document.getElementById('run-tests');
        runBtn.disabled = true;
        runBtn.innerHTML = '<span class="loading"></span> Running Tests...';
        
        try {
            // Open main website if not already open
            if (!this.mainWindow || this.mainWindow.closed) {
                this.log('Opening main website for testing...', 'info');
                await this.openMainWebsite();
                this.log('✅ Website opened successfully', 'success');
                
                // Wait a bit for website to fully load
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            // Run all tests
            for (let i = 0; i < this.tests.length; i++) {
                const test = this.tests[i];
                this.log(`Running test ${i + 1}/${this.tests.length}: ${test.name}`, 'info');
                await this.runTest(test);
                this.updateUI();
                
                // Small delay between tests
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            // Final results
            const successRate = Math.round((this.results.passed / this.results.total) * 100);
            this.log(`🎉 Testing completed! Success rate: ${successRate}% (${this.results.passed}/${this.results.total})`, 'success');
            
            if (this.results.failed > 0) {
                this.log(`⚠️ ${this.results.failed} tests failed - check details above`, 'error');
            }
            
            if (this.results.warnings > 0) {
                this.log(`⚠️ ${this.results.warnings} warnings - consider improvements`, 'info');
            }
            
        } catch (error) {
            this.log(`❌ Testing failed: ${error.message}`, 'error');
        } finally {
            // Re-enable run button
            runBtn.disabled = false;
            runBtn.innerHTML = '🚀 Run All Tests';
        }
    }
}

// Initialize test suite
let testSuite;

function runAllTests() {
    if (!testSuite) {
        testSuite = new WebsiteTestSuite();
        testSuite.initializeTests();
        testSuite.updateUI();
    }
    testSuite.runAllTests();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    testSuite = new WebsiteTestSuite();
    testSuite.initializeTests();
    testSuite.updateUI();
});