"use client";

import { useMemo, useState } from "react";
import { useAppSelector } from "@/store/hooks";

import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
} from "mdb-react-ui-kit";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

type Period = "7d" | "30d" | "all";

export default function AdminDashboard() {
  const orders = useAppSelector((state) => state.orders.orders);

  const [period, setPeriod] = useState<Period>("7d");

  // 🧠 FILTRO POR PERÍODO
  const filteredOrders = useMemo(() => {
    if (period === "all") return orders;

    const now = new Date();
    const days = period === "7d" ? 7 : 30;

    return orders.filter((order) => {
      const date = new Date(order.date.split("/").reverse().join("-"));
      const diff =
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      return diff <= days;
    });
  }, [orders, period]);

  // 📊 KPIs
  const kpis = useMemo(() => {
    const totalOrders = filteredOrders.length;

    const totalRevenue = filteredOrders.reduce(
      (acc, order) => acc + order.total,
      0
    );

    const delivered = filteredOrders.filter(
      (o) => o.status === "delivered"
    ).length;

    const inProgress = filteredOrders.filter(
      (o) => o.status !== "delivered"
    ).length;

    return {
      totalOrders,
      totalRevenue,
      delivered,
      inProgress,
    };
  }, [filteredOrders]);

  // 📊 STATUS CHART
  const statusData = useMemo(() => {
    const statusCount = {
      confirmed: 0,
      paid: 0,
      separating: 0,
      shipping: 0,
      delivered: 0,
    };

    filteredOrders.forEach((order) => {
      statusCount[order.status]++;
    });

    return [
      { name: "Confirmado", value: statusCount.confirmed },
      { name: "Pago", value: statusCount.paid },
      { name: "Separação", value: statusCount.separating },
      { name: "Transporte", value: statusCount.shipping },
      { name: "Entregue", value: statusCount.delivered },
    ];
  }, [filteredOrders]);

  // 📈 FATURAMENTO POR DIA
  const revenueData = useMemo(() => {
    const map: Record<string, number> = {};

    filteredOrders.forEach((order) => {
      const key = order.date;

      if (!map[key]) map[key] = 0;
      map[key] += order.total;
    });

    return Object.entries(map).map(([date, value]) => ({
      date,
      value,
    }));
  }, [filteredOrders]);

  // 🛍️ PRODUTOS MAIS VENDIDOS
  const topProducts = useMemo(() => {
    const map: Record<string, number> = {};

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!map[item.name]) map[item.name] = 0;
        map[item.name] += item.quantity;
      });
    });

    return Object.entries(map)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredOrders]);

  return (
    <main>
      {/* HEADER */}
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold mb-1">Dashboard</h2>
          <p className="text-muted mb-0">
            Visão geral da sua loja
          </p>
        </div>

        {/* FILTRO */}
        <div className="d-flex gap-2">
          <MDBBtn
            size="sm"
            outline={period !== "7d"}
            onClick={() => setPeriod("7d")}
          >
            7 dias
          </MDBBtn>

          <MDBBtn
            size="sm"
            outline={period !== "30d"}
            onClick={() => setPeriod("30d")}
          >
            30 dias
          </MDBBtn>

          <MDBBtn
            size="sm"
            outline={period !== "all"}
            onClick={() => setPeriod("all")}
          >
            Tudo
          </MDBBtn>
        </div>
      </header>

      {/* KPI */}
      <section className="mb-4">
        <MDBRow>
          <MDBCol md="3">
            <MDBCard className="shadow-0 border">
              <MDBCardBody>
                <small className="text-muted">Pedidos</small>
                <h4 className="fw-bold">{kpis.totalOrders}</h4>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="3">
            <MDBCard className="shadow-0 border">
              <MDBCardBody>
                <small className="text-muted">Faturamento</small>
                <h4 className="fw-bold">
                  R$ {kpis.totalRevenue.toFixed(2)}
                </h4>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="3">
            <MDBCard className="shadow-0 border">
              <MDBCardBody>
                <small className="text-muted">Entregues</small>
                <h4 className="fw-bold text-success">
                  {kpis.delivered}
                </h4>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="3">
            <MDBCard className="shadow-0 border">
              <MDBCardBody>
                <small className="text-muted">Em andamento</small>
                <h4 className="fw-bold">{kpis.inProgress}</h4>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </section>

      {/* GRÁFICOS */}
      <section>
        <MDBRow>
          {/* STATUS */}
          <MDBCol md="6">
            <MDBCard className="shadow-0 border mb-4">
              <MDBCardBody>
                <h6 className="fw-bold mb-4">Pedidos por status</h6>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          {/* FATURAMENTO */}
          <MDBCol md="6">
            <MDBCard className="shadow-0 border mb-4">
              <MDBCardBody>
                <h6 className="fw-bold mb-4">Faturamento por dia</h6>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" />
                  </LineChart>
                </ResponsiveContainer>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </section>

      {/* TOP PRODUTOS */}
      <section>
        <MDBCard className="shadow-0 border">
          <MDBCardBody>
            <h6 className="fw-bold mb-4">Produtos mais vendidos</h6>

            <ul className="list-unstyled mb-0">
              {topProducts.map((product) => (
                <li
                  key={product.name}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>{product.name}</span>
                  <strong>{product.quantity}</strong>
                </li>
              ))}
            </ul>
          </MDBCardBody>
        </MDBCard>
      </section>
    </main>
  );
}