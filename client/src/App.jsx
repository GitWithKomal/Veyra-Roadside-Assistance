import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import RoadsideMap from "./components/map/RoadsideMap";
import MechanicDashboard from "./pages/MechanicDashboard";
import CustomerRequests from "./pages/CustomerRequests";

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div>
          <h1 className="text-xl font-bold">Roadside AAA</h1>

          <p className="text-sm text-gray-500">Welcome, {user?.name}</p>

          <p className="text-xs text-purple-600 font-medium mt-1">
            Role: {user?.role}
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        {user?.role === "admin" ? (
          <AdminDashboard />
        ) : user?.role === "mechanic" ? (
          <MechanicDashboard />
        ) : (
          <>
            <RoadsideMap />

            <div className="mt-8">
              <CustomerRequests />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
