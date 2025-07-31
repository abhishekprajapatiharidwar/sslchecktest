# 🌟 Beautiful Static Portfolio Website

A modern, responsive portfolio website built with HTML, CSS, and JavaScript featuring automatic deployment via GitHub Actions.

## 🚀 Live Demo

Visit the live website: [Your Website URL](https://yourusername.github.io/ngstatic)

## ✨ Features

- 📱 **Fully Responsive Design** - Works on all devices
- 🎨 **Modern UI/UX** - Beautiful gradients and animations
- ⚡ **Fast Performance** - Optimized static files
- 🧪 **Comprehensive Testing** - Automated test suite
- 🔄 **CI/CD Pipeline** - Automatic deployment on code changes
- 📧 **Contact Form** - With validation
- 🎯 **Smooth Scrolling** - Enhanced user experience

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Fonts**: Google Fonts (Poppins)
- **Icons**: Font Awesome
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🏗️ Project Structure

```
ngstatic/
├── index.html              # Main website
├── style.css              # Styling
├── script.js              # JavaScript functionality
├── test.html              # Test suite interface
├── test-suite.js          # Automated testing
├── .github/
│   └── workflows/
│       └── deploy.yml     # CI/CD pipeline
└── README.md              # Documentation
```

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ngstatic.git
   cd ngstatic
   ```

2. **Start local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### GitHub Deployment Setup

1. **Create GitHub Repository**
   - Go to GitHub and create a new repository named `ngstatic`
   - Make it public for GitHub Pages

2. **Push your code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Beautiful portfolio website"
   git branch -M main
   git remote add origin https://github.com/yourusername/ngstatic.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Source: GitHub Actions
   - The site will be automatically deployed!

## 🧪 Testing

Run the comprehensive test suite:

1. **Open test interface**
   ```
   http://localhost:8000/test.html
   ```

2. **Click "Run All Tests"**

3. **View detailed results**
   - HTML Structure Tests
   - CSS Styling Tests
   - JavaScript Functionality Tests
   - Responsive Design Tests
   - Navigation Tests
   - Form Validation Tests

## 🔄 CI/CD Pipeline

The automated deployment pipeline includes:

- ✅ **Code Quality Checks**
- 🧪 **Automated Testing**
- 🏗️ **Build Process**
- 🚀 **Deployment to GitHub Pages**
- 📢 **Status Notifications**

### Deployment Triggers

- Push to `main` branch
- Pull requests to `main` branch
- Manual workflow dispatch

## 📁 Sections

- **🏠 Home** - Hero section with introduction
- **👨‍💻 About** - Skills and experience
- **💼 Services** - Offered services
- **🎨 Portfolio** - Projects showcase
- **📞 Contact** - Contact form and information

## 🎨 Customization

### Colors & Theme
Edit CSS custom properties in `style.css`:
```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #fbbf24;
}
```

### Content
Update content in `index.html`:
- Personal information
- Skills and services
- Portfolio projects
- Contact details

### Styling
Modify `style.css` for:
- Layout changes
- Color schemes
- Animations
- Responsive breakpoints

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🔧 Development Scripts

```bash
# Start development server
python -m http.server 8000

# Run tests
open http://localhost:8000/test.html

# Build for production (static files)
# No build process needed - files are ready to deploy
```

## 📈 Performance

- ⚡ **Fast Loading** - Optimized assets
- 📱 **Mobile First** - Responsive design
- 🎯 **SEO Friendly** - Semantic HTML
- ♿ **Accessible** - ARIA labels and semantic markup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for typography
- [GitHub Pages](https://pages.github.com/) for hosting

## 📞 Support

If you have any questions or need help with deployment:

- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ngstatic/issues)

---

Made with ❤️ and deployed with 🚀 GitHub Actions