# Contributing to Tempo

Thank you for considering contributing to Tempo! We welcome contributions from everyone.

## 📋 Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 70+, Firefox 65+, Safari 12+, Edge 79+)
- Basic knowledge of HTML, CSS, and JavaScript
- Git for version control

### Setting up Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/temp.git
   cd temp
   ```

2. **Set up upstream remote**
   ```bash
   git remote add upstream https://github.com/abhinavramanan/temp.git
   ```

3. **Start local development server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   
   # Then visit http://localhost:8000
   ```

## 🔧 Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style and conventions
   - Test your changes across different browsers
   - Ensure responsive design works on mobile devices

3. **Test thoroughly**
   - Test all existing functionality to ensure nothing breaks
   - Test your new feature in different browsers
   - Check localStorage functionality
   - Verify offline mode works correctly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Guidelines

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add task priority filtering
fix: pomodoro timer not resetting correctly
docs: update installation instructions
style: improve button hover effects
```

## 🎨 Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Maintain proper indentation (2 spaces)
- Include appropriate ARIA labels for accessibility
- Use meaningful IDs and class names

### CSS
- Follow existing variable naming conventions
- Use CSS custom properties for themes
- Maintain responsive design principles
- Group related styles together
- Comment complex selectors

### JavaScript
- Use ES6+ features consistently
- Follow existing naming conventions (camelCase for variables/functions)
- Add comments for complex logic
- Maintain consistent error handling
- Use const/let instead of var

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, please test:

- [ ] **Task Management**
  - [ ] Create new tasks
  - [ ] Edit existing tasks
  - [ ] Delete tasks (with confirmation)
  - [ ] Mark tasks as complete/incomplete
  - [ ] Filter tasks (All, Active, Completed)
  - [ ] Search functionality

- [ ] **Pomodoro Timer**
  - [ ] Start/pause timer
  - [ ] Timer countdown works correctly
  - [ ] Session transitions (focus → break → focus)
  - [ ] Task selection integration
  - [ ] Audio notifications (if enabled)
  - [ ] Progress tracking

- [ ] **Analytics**
  - [ ] Summary cards update correctly
  - [ ] Time tracking accuracy
  - [ ] Data export functionality
  - [ ] Filter by time periods

- [ ] **Settings**
  - [ ] Timer duration changes apply correctly
  - [ ] Notification preferences save
  - [ ] Theme switching works
  - [ ] Accent color changes apply
  - [ ] Data import/export functions
  - [ ] Settings persist after browser refresh

- [ ] **Cross-browser Compatibility**
  - [ ] Chrome/Chromium
  - [ ] Firefox
  - [ ] Safari (if available)
  - [ ] Edge

- [ ] **Responsive Design**
  - [ ] Mobile viewport (320px+)
  - [ ] Tablet viewport (768px+)
  - [ ] Desktop viewport (1024px+)

## 📝 Documentation

When contributing, please also update:
- README.md if you add new features
- Code comments for complex functionality
- This CONTRIBUTING.md if you change the development process

## 🐛 Bug Reports

### Before Submitting a Bug Report
- Check if the bug has already been reported in [Issues](https://github.com/abhinavramanan/temp/issues)
- Try to reproduce the bug in different browsers
- Check if the bug exists in the latest version

### How to Submit a Bug Report

1. **Use the issue template** (if available)

2. **Include detailed information:**
   - Browser name and version
   - Operating system
   - Steps to reproduce the bug
   - Expected behavior
   - Actual behavior
   - Screenshots or screen recordings (if applicable)
   - Console errors (if any)

3. **Example Bug Report:**
   ```markdown
   **Bug Description**
   Pomodoro timer doesn't stop when task is deleted
   
   **Steps to Reproduce**
   1. Create a new task
   2. Start pomodoro timer for that task
   3. Delete the task while timer is running
   4. Timer continues running
   
   **Expected Behavior**
   Timer should stop when associated task is deleted
   
   **Environment**
   - Browser: Chrome 91.0.4472.124
   - OS: macOS Big Sur 11.4
   ```

## 💡 Feature Requests

We welcome feature suggestions! When submitting a feature request:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** the feature would solve
3. **Describe your proposed solution**
4. **Consider alternatives** you've thought about
5. **Think about implementation** complexity

## 🔍 Pull Request Process

1. **Before submitting:**
   - Ensure your code follows the style guidelines
   - Test your changes thoroughly
   - Update documentation if needed
   - Rebase your branch on the latest main

2. **PR Description should include:**
   - Clear description of changes
   - Link to related issues (if any)
   - Screenshots/GIFs for UI changes
   - Testing notes

3. **PR Review Process:**
   - Maintainers will review your PR
   - Address any requested changes
   - Once approved, your PR will be merged

4. **After your PR is merged:**
   - Delete your feature branch
   - Update your local main branch
   - Celebrate your contribution! 🎉

## 🏷️ Labels

We use labels to categorize issues and PRs:

- `bug` - Something isn't working
- `enhancement` - New feature or request  
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## 🤝 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Future release notes for significant contributions
- README acknowledgments for major features

## ❓ Questions?

Feel free to:
- Open an issue with the `question` label
- Start a discussion in the Discussions tab
- Reach out to maintainers directly

Thank you for contributing to Tempo! 🚀