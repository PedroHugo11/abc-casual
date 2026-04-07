"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBBadge,
  MDBInput,
} from "mdb-react-ui-kit";

import { CheckCircle, CreditCard, Package, Truck, Home } from "lucide-react";

import {
  updateOrderStatus,
  updateTracking,
} from "@/features/orders/ordersSlice";
import type { Order, OrderStatus } from "@/features/orders/types";
import "./ordersStyle.css";

// LABEL
const statusLabel: Record<OrderStatus, string> = {
  confirmed: "Confirmado",
  paid: "Pago",
  separating: "Separação",
  shipping: "Transporte",
  delivered: "Entregue",
};

// TIMELINE
const steps = [
  { key: "confirmed", icon: CheckCircle },
  { key: "paid", icon: CreditCard },
  { key: "separating", icon: Package },
  { key: "shipping", icon: Truck },
  { key: "delivered", icon: Home },
];

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const dispatch = useAppDispatch();

  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

  const orders = useAppSelector((state): Order[] => state.orders.orders);
  const order = orders.find((o: Order) => o.id === orderId);

  const [tracking, setTracking] = useState(order?.tracking || "");

  if (!order) return <p>Pedido não encontrado</p>;

  const currentStep = steps.findIndex((s) => s.key === order.status);

  function handleStatusChange(status: OrderStatus) {
    if (order) {
      dispatch(updateOrderStatus({ id: order.id, status }));
    }
  }

  function handleTrackingSave() {
    if (order) {
      dispatch(updateTracking({ id: order.id, tracking }));
    }
  }

  function getStatusColor(status: OrderStatus) {
    if (status === "confirmed") return "dark";
    if (status === "delivered") return "success";
    return "warning";
  }

  return (
    <main>
      <MDBContainer className="py-5">
        {/* HEADER */}
        <header className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-1">Pedido #{order.id}</h2>
            <p className="text-muted mb-0">{order.date}</p>
            {order.tracking && (
              <small className="text-muted">
                Código de rastreio: <strong>{order.tracking}</strong>
              </small>
            )}
          </div>

          <MDBBadge color={getStatusColor(order.status as OrderStatus)} pill>
            {statusLabel[order.status as OrderStatus]}
          </MDBBadge>
        </header>

        {/* STATUS + TRACKING */}
        <section className="mb-4">
          <MDBCard className="border shadow-0">
            <MDBCardBody>
              <div className="admin-order-header mb-3">
                <div className="w-50">
                  <h6 className="fw-bold mb-2">Alterar status</h6>

                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(e.target.value as OrderStatus)
                    }
                  >
                    {Object.entries(statusLabel).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-50">
                  <h6 className="fw-bold mb-2">Código de rastreio</h6>

                  <div className="tracking-wrapper">
                    <MDBInput
                      value={tracking}
                      onChange={(e) => setTracking(e.target.value)}
                      label="Tracking"
                    />

                    <MDBBtn className="w-25" color="dark" onClick={handleTrackingSave} block>
                      Salvar
                    </MDBBtn>
                  </div>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="order-timeline mt-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStep;
                  const isDelivered = order.status === "delivered";

                  return (
                    <div
                      key={step.key}
                      className={`timeline-item ${
                        isActive ? "active" : ""
                      } ${isDelivered ? "delivered" : ""}`}
                    >
                      <div
                        className={`icon-wrapper ${isActive ? "active" : ""}`}
                      >
                        <Icon size={18} />
                      </div>

                      <small className="timeline-label">
                        {statusLabel[step.key as OrderStatus]}
                      </small>

                      {index !== steps.length - 1 && (
                        <div className={`line ${isActive ? "active" : ""}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </MDBCardBody>
          </MDBCard>
        </section>

        {/* PRODUTOS */}
        <section className="mb-4">
          <MDBCard className="border shadow-0">
            <MDBCardBody>
              <h6 className="fw-bold mb-4">Itens</h6>

              {order.items.map((item) => (
                <MDBRow key={item.productId} className="mb-3">
                  <MDBCol md="2">
                    <img src={item.image} className="img-fluid rounded" />
                  </MDBCol>

                  <MDBCol md="6">
                    <strong>{item.name}</strong>
                    <div className="text-muted small">
                      {item.color} • {item.size}
                    </div>
                  </MDBCol>

                  <MDBCol md="4" className="text-end">
                    <strong>
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </MDBCol>
                </MDBRow>
              ))}
            </MDBCardBody>
          </MDBCard>
        </section>

        {/* ADDRESS + PAYMENT */}
        <section>
          <MDBRow>
            <MDBCol md="6">
              <MDBCard>
                <MDBCardBody>
                  <h6 className="fw-bold mb-3">Endereço</h6>
                  <p>{order.address.name}</p>
                  <p>
                    {order.address.street}, {order.address.number}
                  </p>
                  <p>
                    {order.address.city} - {order.address.state}
                  </p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol md="6">
              <MDBCard>
                <MDBCardBody>
                  <h6 className="fw-bold mb-3">Pagamento</h6>
                  <p>{order.payment.method}</p>

                  {order.payment.method === "credit" && (
                    <p>**** {order.payment.last4}</p>
                  )}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </section>
      </MDBContainer>
    </main>
  );
}
