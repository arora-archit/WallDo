# WallDo

WallDo is a desktop application built using **Electron**, **React**, and **TypeScript**, designed for exploring, downloading, and setting wallpapers from Wallhaven. The app provides a clean and interactive user interface alongside functionality for browsing wallpaper feeds and managing local directories for storing images.

## Features

- **Wallpaper Feed:** Browse and load wallpapers directly from Wallhaven's API.
- **Custom Backgrounds:** Easily download and set wallpapers directly from the application.
- **Cross-Platform Support:** Compatible with Windows, macOS, and Linux.
- **Modern UI:** Built using TailwindCSS and React.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or above)
- **pnpm** (preferred package manager for this project)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/walldo.git
   cd walldo
   ```

2. Install dependencies using `pnpm`:

   ```bash
   pnpm install
   ```

3. Start the development mode:

   ```bash
   pnpm run dev
   ```

4. Build the app for production:

   ```bash
   pnpm run build
   ```

5. Start the Electron application (after build):

   ```bash
   pnpm run electron:build
   ```

### Scripts

| Command              | Description                          |
|----------------------|--------------------------------------|
| `pnpm run dev`       | Starts the app in development mode  |
| `pnpm run build`     | Builds the app for production       |
| `pnpm run lint`      | Lint the codebase using ESLint      |
| `pnpm run prettier`  | Formats the code using Prettier     |
| `pnpm run electron:build` | Builds the Electron app for deployment |

### Application Technologies

- **Frameworks:** Electron, React, TypeScript
- **UI Library:** TailwindCSS
- **Tools & Libraries:** Axios, React LazyLoad, React Router DOM, React Grid System

## Usage

1. **Wallpaper Feed:** Navigate to the feed section to explore wallpapers from Wallhaven.
2. **Image Download:** Click on an image to download it locally.
3. **Set Wallpaper:** Set an image as your system wallpaper directly from the app.

## Development

### Linting & Format

- Run ESLint:

  ```bash
  pnpm run lint
  ```

- Format code with Prettier:

  ```bash
  pnpm run prettier
  ```

### Coding Standards

WallDo follows coding standards enforced by `.eslintrc.json` and `prettier.config.js`. Code formatting rules include consistent semicolons, spaces within object literals, and spacing between imports.

## License

This project is licensed under the [GPL-3.0 License](LICENSE).

## Contribution

Interested in contributing? See the **[CONTRIBUTING.md](public/CONTRIBUTING.md)** file for details on submitting pull requests or bug reports.

---

Happy coding! 🚀
