# Contributing to WallDo

First of all, thank you for your interest in contributing to the **WallDo** project! 🎉

By contributing to this repository, you help improve and enrich the overall user experience of the application. Please follow the below guidelines for submitting contributions.

---

## What You Can Contribute

1. **Bug Fixes:**
  - Found a bug? Let us know by opening an issue or submitting a pull request (PR) with a fix.
2. **New Features:**
  - Got an idea for a new feature? Suggest it in the Issues tab or implement it and submit a PR.
3. **Code Maintenance:**
  - Refactor/reformat code or improve application performance.
4. **Documentation:**
  - Help us enhance the documentation or tutorials.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js:** v18 or above
- **pnpm:** Preferred package manager for managing dependencies in this project.

### Steps to Contribute:

1. **Fork the Repository**
  - Start by forking the main repository to your account.

2. **Clone Your Fork**
  - Clone your copy of the repository:

    ```bash
    git clone https://github.com/your-username/walldo.git
    cd walldo
    ```

3. **Set Up Upstream Remote**
  - Add the original repository as an upstream remote:

    ```bash
    git remote add upstream https://github.com/main-repo/walldo.git
    ```

4. **Install Dependencies**
  - Install the dependencies using `pnpm`:

    ```bash
    pnpm install
    ```

5. **Create a Feature Branch**
  - Use a descriptive name for your branch:

    ```bash
    git checkout -b feature/new-awesome-feature
    ```

6. **Make Changes**
  - Implement new features, bug fixes, or improvements.

7. **Lint & Format**
  - Run linting to ensure consistency:

    ```bash
    pnpm run lint
    ```

  - Format code using Prettier:

    ```bash
    pnpm run prettier
    ```

8. **Commit & Push**
  - Commit your changes with a meaningful message:

    ```bash
    git commit -m "Add [feature/bug description]"
    git push origin feature/new-awesome-feature
    ```
w
9. **Open a Pull Request**
  - Open a PR to the `main` branch of the original repository.

---

## Contribution Guidelines

- Please adhere to the existing code style. The rules are defined in `.eslintrc.json` and formatting is handled by Prettier.
- Add descriptive commit messages for better understanding of history.
- Ensure all tests and builds pass before submitting your PR.

---

## Need Help?

Found an issue, or need help with development? Feel free to open an [issue](https://github.com/main-repo/walldo/issues) or contact the maintainers.

We are looking forward to your contributions! 🚀
