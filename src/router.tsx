import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ContractsPage from "@/pages/ContractsPage";
import ContractDetailPage from "@/pages/ContractDetailPage";
import ClientsPage from "@/pages/ClientsPage";
import ClientDetailPage from "@/pages/ClientDetailPage";
import AdvisorsPage from "@/pages/AdvisorsPage";
import AdvisorDetailPage from "@/pages/AdvisorDetailPage";
import LoginPage from "@/pages/LoginPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <ContractsPage /> },
      { path: "/contracts", element: <ContractsPage /> },
      { path: "/contracts/:id", element: <ContractDetailPage /> },
      { path: "/clients", element: <ClientsPage /> },
      { path: "/clients/:id", element: <ClientDetailPage /> },
      { path: "/advisors", element: <AdvisorsPage /> },
      { path: "/advisors/:id", element: <AdvisorDetailPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
]);
