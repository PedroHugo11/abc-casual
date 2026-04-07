"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";

import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBBadge,
} from "mdb-react-ui-kit";

import { updateOrderStatus } from "@/features/orders/ordersSlice";
import type { OrderStatus } from "@/features/orders/types";

// labels
const statusLabel: Record<string, string> = {
  confirmed: "Confirmado",
  paid: "Pago",
  separating: "Separação",
  shipping: "Transporte",
  delivered: "Entregue",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const orders = useAppSelector((state) => state.orders.orders);
  console.log("ADMIN ORDERS:", orders);

  const [showAll, setShowAll] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [search, setSearch] = useState("");

  function handleStatusChange(id: string, status: OrderStatus) {
    dispatch(updateOrderStatus({ id, status }));
  }

  // 🔍 FILTRO + BUSCA
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = filterStatus ? order.status === filterStatus : true;

      const matchesSearch = search ? order.id.includes(search) : true;

      return matchesStatus && matchesSearch;
    });
  }, [orders, filterStatus, search]);

  const ordersToShow = showAll ? filteredOrders : filteredOrders.slice(0, 3);

  // 🧠 TYPE GUARD PARA STATUS
  function isOrderStatus(value: string): value is OrderStatus {
    return [
      "confirmed",
      "paid",
      "separating",
      "shipping",
      "delivered",
    ].includes(value);
  }

  return (
    <main>
      <header className="mb-4">
        <h2 className="fw-bold">Pedidos</h2>
        <p className="text-muted mb-3">Gerencie os pedidos da loja</p>

        {/* FILTROS */}
        <div className="d-flex gap-2 flex-wrap">
          <input
            className="form-control w-auto"
            placeholder="Buscar por ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-select w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="confirmed">Confirmado</option>
            <option value="paid">Pago</option>
            <option value="separating">Separação</option>
            <option value="shipping">Transporte</option>
            <option value="delivered">Entregue</option>
          </select>
        </div>
      </header>

      <section>
        {ordersToShow.length === 0 && (
          <p className="text-muted">Nenhum pedido encontrado.</p>
        )}

        {ordersToShow.map((order) => (
          <article key={order.id} className="mb-4">
            <MDBCard className="shadow-0 border">
              <MDBCardBody>
                {/* HEADER */}
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <strong>Pedido #{order.id}</strong>
                    <div className="text-muted small">{order.date}</div>
                  </div>

                  <MDBBadge
                    color={order.status === "delivered" ? "success" : "dark"}
                    pill
                  >
                    {statusLabel[order.status]}
                  </MDBBadge>
                </div>

                <hr />

                <MDBRow className="align-items-center">
                  {/* PRODUTO */}
                  <MDBCol md="4">
                    <div className="d-flex gap-3 align-items-center">
                      <img
                        src={order.items[0].image}
                        width={60}
                        className="rounded"
                      />

                      <div>
                        <div className="fw-bold">{order.items[0].name}</div>

                        <small className="text-muted">
                          {order.items.length} item(s)
                        </small>
                      </div>
                    </div>
                  </MDBCol>

                  {/* STATUS */}
                  <MDBCol md="4">
                    <select
                      className="form-select"
                      value={order.status}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (isOrderStatus(value)) {
                          handleStatusChange(order.id, value);
                        }
                      }}
                    >
                      <option value="confirmed">Confirmado</option>
                      <option value="paid">Pago</option>
                      <option value="separating">Separação</option>
                      <option value="shipping">Transporte</option>
                      <option value="delivered">Entregue</option>
                    </select>
                  </MDBCol>

                  {/* AÇÕES */}
                  <MDBCol md="4" className="text-end">
                    <MDBBtn
                      size="sm"
                      outline
                      color="dark"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      Ver detalhes
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </article>
        ))}
      </section>

      {/* PAGINAÇÃO SIMPLES */}
      {filteredOrders.length > 3 && (
        <div className="text-center mt-4">
          <MDBBtn outline color="dark" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Mostrar menos" : "Ver mais pedidos"}
          </MDBBtn>
        </div>
      )}
    </main>
  );
}
