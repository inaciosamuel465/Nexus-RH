# AI Rules for Nexus HR Application

This document outlines the core technologies used in the Nexus HR application and provides clear guidelines on which libraries and frameworks to use for specific functionalities.

## Tech Stack Description

*   **Frontend Framework**: React (version 19.x) for building dynamic and interactive user interfaces.
*   **Language**: TypeScript for type-safe code, enhancing maintainability and developer experience.
*   **Routing**: React Router (version 7.x) for declarative navigation and managing application routes.
*   **Styling**: Tailwind CSS for utility-first CSS styling, enabling rapid and consistent UI development.
*   **UI Components**: shadcn/ui for pre-built, accessible, and customizable UI components.
*   **Icons**: Lucide React for a comprehensive set of SVG icons.
*   **AI Integration**: Google GenAI for integrating advanced artificial intelligence capabilities, such as candidate analysis and HR insights.
*   **Data Visualization**: Recharts for creating responsive and interactive charts and graphs.
*   **Build Tool**: Vite for a fast development server and optimized production builds.
*   **State Management**: React Context API for global state management across components.

## Library Usage Rules

To maintain consistency, performance, and best practices, please adhere to the following rules when developing or modifying the application:

*   **Core UI Development**: Always use **React** and **TypeScript**.
*   **Routing**: All client-side routing must be handled using **React Router**. Keep routes defined in `src/App.tsx`.
*   **Styling**: Apply all styling using **Tailwind CSS** utility classes. Avoid inline styles or custom CSS files unless absolutely necessary for complex, isolated components.
*   **UI Components**:
    *   Prioritize using components from **shadcn/ui**. These are already installed and configured.
    *   If a required component is not available in shadcn/ui or needs significant customization, create a new, small, and focused custom component in `src/components/`.
*   **Icons**: Use icons from the **lucide-react** library.
*   **AI Functionality**: All AI-related features and integrations must use the **Google GenAI** library.
*   **Charting and Graphs**: For any data visualization needs, use **Recharts**.
*   **State Management**: For application-wide state, leverage the **React Context API** (e.g., `HRContext`). For local component state, use React's `useState` and `useReducer` hooks.
*   **Notifications**: Use `react-hot-toast` for all toast notifications to inform users about important events.
*   **File Structure**:
    *   Place all source code within the `src` folder.
    *   Pages should reside in `src/pages/`.
    *   Reusable components should be in `src/components/`.
    *   Utility functions should be in `src/utils/`.
    *   Contexts should be in `src/context/`.
    *   Service integrations should be in `src/services/`.
*   **New Components**: Always create a new file for every new component or hook, no matter how small. Do not add new components to existing files.
*   **Responsiveness**: All designs must be responsive and adapt well to different screen sizes.