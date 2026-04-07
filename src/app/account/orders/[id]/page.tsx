"use client";

import { useParams } from "next/navigation";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBBadge,
} from "mdb-react-ui-kit";
import { useAppSelector } from "@/store/hooks";
import { CheckCircle, CreditCard, Package, Truck, Home } from "lucide-react";
import Sidebar from "../../AccountSidebar";
import "../../ordersStyle.css";
import { Order } from "@/features/orders/types";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

  const orders = useAppSelector((state): Order[] => state.orders.orders);
  const order = orders.find((o: Order) => o.id === orderId);

  // map de status
  const statusMap: Record<string, number> = {
    confirmed: 0,
    paid: 1,
    separating: 2,
    shipping: 3,
    delivered: 4,
  };

  const statusLabel: Record<string, string> = {
    confirmed: "Pedido confirmado",
    paid: "Pagamento aprovado",
    separating: "Em separação",
    shipping: "Em transporte",
    delivered: "Entregue",
  };

  const steps = [
    { label: "Pedido confirmado", icon: CheckCircle },
    { label: "Pagamento aprovado", icon: CreditCard },
    { label: "Em separação", icon: Package },
    { label: "Em transporte", icon: Truck },
    { label: "Entregue", icon: Home },
  ];

  if (!order) {
    return <p>Pedido não encontrado</p>;
  }

  // fallback seguro
  const currentStep = statusMap[order.status] ?? 0;
  const isDelivered = order.status === "delivered";

  return (
    <main>
      <MDBContainer className="py-5">
        <MDBRow>
          {/* SIDEBAR */}
          <Sidebar />

          {/* CONTENT */}
          <MDBCol md="8">
            <header className="mb-4 d-flex justify-content-start align-items-center">
              <div>
                <h1 className="h4 fw-bold mb-1">Pedido #{order.id}</h1>
                <p className="text-muted mb-0">Realizado em {order.date}</p>
              </div>
            </header>

            {/* STATUS */}

            <section className="mb-4">
              <MDBCard className="border">
                <MDBCardBody>
                  <MDBRow className="align-items-center mb-3">
                    <MDBCol md="8">
                      <h6 className="mb-2 fw-bold">Status do pedido</h6>

                      <MDBBadge
                        color={
                          statusLabel[order.status] == "Entregue"
                            ? "success"
                            : "dark"
                        }
                        pill
                        className="px-3 py-2"
                      >
                        {statusLabel[order.status]}
                      </MDBBadge>
                    </MDBCol>

                    <MDBCol md="4" className="text-end">
                      <MDBBtn color="warning" className="fw-bold">
                        Acompanhar entrega
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>

                  {/* PROGRESSO (MDB style adaptado) */}

                  {/* TIMELINE */}
                  <div className="order-timeline mt-4">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = isDelivered || index <= currentStep;

                      return (
                        <div key={index} className="timeline-item">
                          {/* ÍCONE */}
                          <div
                            className={`icon-wrapper 
                                ${isActive ? "active" : ""} 
                                ${isDelivered ? "delivered" : ""}
                            `}
                          >
                            <Icon size={18} />
                          </div>

                          {/* LABEL */}
                          <small className="timeline-label">{step.label}</small>

                          {/* LINHA */}
                          {index !== steps.length - 1 && (
                            <div
                              className={`line 
                                    ${isActive ? "active" : ""} 
                                    ${isDelivered ? "delivered" : ""}
                                `}
                            />
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
              <MDBCard className="border">
                <MDBCardBody>
                  <h6 className="mb-4 fw-bold">Itens do pedido</h6>

                  {order.items.map((item, index) => (
                    <div key={item.productId}>
                      <MDBRow className="align-items-center">
                        {/* IMAGEM */}
                        <MDBCol md="2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded"
                          />
                        </MDBCol>

                        {/* INFO */}
                        <MDBCol md="6">
                          <h6 className="mb-1 fw-bold">{item.name}</h6>

                          <p className="text-muted mb-1 small">
                            {item.color} • {item.size}
                          </p>

                          <p className="text-muted mb-0 small">
                            Quantidade: {item.quantity}
                          </p>
                        </MDBCol>

                        {/* PREÇO */}
                        <MDBCol md="4" className="text-end">
                          <h6 className="fw-bold mb-0">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </h6>
                        </MDBCol>
                      </MDBRow>

                      {/* DIVIDER */}
                      {index !== order.items.length - 1 && (
                        <hr className="my-3" />
                      )}
                    </div>
                  ))}
                </MDBCardBody>
              </MDBCard>
            </section>

            {/* ADDRESS + PAYMENT */}
            <section>
              <MDBRow>
                {/* ADDRESS */}

                <MDBCol md="6">
                  <MDBCard className="mb-4">
                    <MDBCardBody>
                      <h5 className="mb-3">Endereço de entrega</h5>

                      <p className="mb-1">{order.address.name}</p>

                      <p className="mb-1">
                        {order.address.street}, {order.address.number}
                      </p>

                      <p className="mb-1">
                        {order.address.city} - {order.address.state}
                      </p>

                      <p className="mb-0">CEP {order.address.zip}</p>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>

                {/* PAYMENT */}

                <MDBCol md="6">
                  <MDBCard>
                    <MDBCardBody>
                      <h5 className="mb-3">Pagamento</h5>

                      <p className="mb-1">Método: {order.payment.method}</p>

                      {order.payment.method === "credit" && (
                        <p className="mb-0">
                          Final do cartão: **** {order.payment.last4}
                        </p>
                      )}
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </section>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </main>
  );
}
