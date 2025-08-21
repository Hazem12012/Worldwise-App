/** @format */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// import HomePage from "./Pages/Homepage";
// import Pricing from "./Pages/Pricing";
// import Product from "./Pages/Product";
// import PageNotFound from "./Pages/PageNotFound";
// import Login from "./Pages/Login";
// import AppLayout from "./Pages/AppLayout";

// Start lazy loading

const HomePage = lazy(() => import("./Pages/Homepage"));
const Pricing = lazy(() => import("./Pages/Pricing"));
const Product = lazy(() => import("./Pages/Product"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound"));
const Login = lazy(() => import("./Pages/Login"));
const AppLayout = lazy(() => import("./Pages/AppLayout"));
// End lazy loading
import CityList from "./Components/CityList";
import CountryList from "./Components/CuntryList";
import City from "./Components/City";
import Form from "./Components/Form";
import { CitiesProvider } from "./contexts/CitiesContext"; //
import { AuthProvider } from "./contexts/FakeAuthContext"; //
import ProtectedRout from "./Pages/ProtectedRout.jsx";
import SpinnerFullPage from "./Components/SpinnerFullPage.jsx";

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="Pricing" element={<Pricing />} />
              <Route path="Product" element={<Product />} />
              <Route path="Login" element={<Login />} />
              <Route
                path="app"
                element={
                  <ProtectedRout>
                    <AppLayout />
                  </ProtectedRout>
                }>
                <Route index element={<Navigate to="cities" replace />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
