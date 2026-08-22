import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import RoadsideMap from "./components/map/RoadsideMap";

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div>
          <h1 className="text-xl font-bold">
            Roadside AAA
          </h1>

          <p className="text-sm text-gray-500">
            Welcome, {user?.name}
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        <RoadsideMap />
      </main>
    </div>
  );
}

export default App;