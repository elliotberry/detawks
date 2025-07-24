# Contributing to Detawks

## Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/elliotberry/detawks.git
   cd detawks
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run tests**

   ```bash
   npm test
   ```

4. **Run linting**

   ```bash
   npm run lint
   ```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration. The following workflows run on every commit and pull request:

### Test Suite (`test.yml`)

- Runs tests on Ubuntu, macOS, and Windows
- Tests with Node.js 20.x and 22.x
- Includes linting checks
- Cleans up test artifacts

### CI/CD Pipeline (`ci.yml`)

- **Test Matrix**: Tests on Ubuntu and macOS with Node.js 20.x and 22.x
- **Security Checks**: Vulnerability scanning with `npm audit`
- **Windows Compatibility**: Dedicated Windows testing
- **Build Verification**: Import verification and CLI testing

## Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Run tests locally**

   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a pull request**

   ```bash
   git push origin feature/your-feature-name
   ```

## Code Quality

- All code must pass the test suite
- Linting warnings are acceptable, but errors should be fixed
- Follow the existing code style and patterns
- Add tests for new functionality

## Test Guidelines

- Tests should be focused and test one specific thing
- Use descriptive test names
- Clean up any test artifacts
- Tests should be deterministic and not depend on external state

## Performance Considerations

- The tool is designed for performance with large file sets
- Consider the impact of changes on processing speed
- Test with realistic file sets when possible
- Monitor memory usage for large operations
