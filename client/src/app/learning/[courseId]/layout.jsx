export default function LearningLayout({ children }) {
    return (
        <div className="h-screen overflow-hidden bg-gray-900 text-white">
            {children}
            {/* Using a Portal or absolute positioning for toasts if needed, but Toaster is in RootLayout */}
        </div>
    );
}
