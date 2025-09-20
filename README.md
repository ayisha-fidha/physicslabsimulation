# Interactive Physics Simulation Lab

An interactive physics simulation lab built with React, Vite, and p5.js. This project allows users to explore various physics concepts through interactive simulations.

## Features

- Interactive physics simulations
- Real-time parameter adjustments
- Visual data display
- Multiple experiment types:
  - Pendulum Motion
  - Projectile Motion
  - Wave Interference (Coming Soon)
  - Free Fall (Coming Soon)
  - Ohm's Law (Coming Soon)

## Demo

Visit the live demo at [https://[your-username].github.io/interactive-sim-lab/](https://[your-username].github.io/interactive-sim-lab/)

## Development

To run this project locally:

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/interactive-sim-lab.git
cd interactive-sim-lab
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Deployment

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

To deploy:

1. Push your changes to the main branch:
```bash
git push origin main
```

2. The GitHub Action will automatically:
   - Build the project
   - Deploy to GitHub Pages
   - Make it available at your GitHub Pages URL

## Configuration

The project uses Vite for building and GitHub Actions for deployment. Key configuration files:

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `vite.config.ts` - Vite configuration
- `package.json` - Project dependencies and scripts

## License

MIT License - Feel free to use this code for your own projects!

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/abd73da8-7c55-4ef4-a4d6-b475806ce316) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/abd73da8-7c55-4ef4-a4d6-b475806ce316) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
