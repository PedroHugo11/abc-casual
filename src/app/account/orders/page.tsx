"use client";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
} from "mdb-react-ui-kit";
import Sidebar from "../AccountSidebar";
import "../ordersStyle.css";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";

export default function OrdersPage() {
  const [showAllOrders, setShowAllOrders] = useState(false);

  const router = useRouter();
  const orders = useAppSelector((state) => state.orders.orders);
  console.log("ACCOUNT ORDERS:", orders);
  const ordersToShow = showAllOrders ? orders : orders.slice(0, 3);

  return (
    <main>
      <MDBContainer className="py-5">
        <MDBRow>
          {/* SIDEBAR */}

          <Sidebar />

          {/* CONTENT */}

          <section className="col-md-9">
            <header className="mb-4">
              <h1 className="h3">Pedidos</h1>
            </header>

            {/* ALERT */}

            <MDBCard className="mb-4 bg-light">
              <MDBCardBody>
                <strong>Alerta de Segurança</strong>

                <p className="mb-0 text-muted">
                  A loja nunca exige taxas extras para concluir a entrega de
                  pedidos já pagos.
                </p>
              </MDBCardBody>
            </MDBCard>

            {/* ORDERS */}

            {orders.length === 0 && (
              <p className="text-muted">Você ainda não possui pedidos.</p>
            )}

            {ordersToShow.map((order) => (
              <article key={order.id} className="mb-4">
                <MDBCard className="order-card">
                  <MDBCardBody>
                    {/* HEADER */}
                    <div className="order-header">
                      <div>
                        <strong>Pedido #{order.id}</strong>
                        <div className="text-muted small">{order.date}</div>
                      </div>

                      <span className="order-status success">
                        {order.status}
                      </span>
                    </div>

                    <hr />

                    <MDBRow className="align-items-center">
                      {/* PRODUTO */}
                      <MDBCol md="4">
                        <div className="order-product">
                          <img src={order.items[0].image} />

                          <div>
                            <h6>{order.items[0].name}</h6>

                            <small className="text-muted">
                              {order.items[0].color} • {order.items[0].size}
                            </small>

                            <br />

                            <strong>
                              R$ {order.items[0].price.toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      </MDBCol>

                      {/* STATUS */}
                      <MDBCol md="4" className="text-center">
                        <div className="order-delivery">
                          <i className="fas fa-check-circle"></i>

                          <p className="mb-1">Entregue em</p>

                          <strong>{/*order.deliveryDate*/ "10/10/2024"}</strong>
                        </div>
                      </MDBCol>

                      {/* RESUMO */}
                      <MDBCol md="4">
                        <div className="order-summary">
                          <p>
                            Total: <strong>R$ {order.total.toFixed(2)}</strong>
                          </p>

                          <MDBBtn
                            size="sm"
                            color="warning"
                            block
                            className="mb-2"
                          >
                            Comprar novamente
                          </MDBBtn>

                          <MDBBtn
                            size="sm"
                            outline
                            color="dark"
                            block
                            onClick={() =>
                              router.push(`/account/orders/${order.id}`)
                            }
                          >
                            Ver detalhes
                          </MDBBtn>
                        </div>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                </MDBCard>
              </article>
            ))}

            {orders.length > 3 && (
              <div className="text-center mt-4">
                <MDBBtn
                  outline
                  color="dark"
                  onClick={() => setShowAllOrders(!showAllOrders)}
                >
                  {showAllOrders ? "Mostrar menos" : "Ver mais pedidos"}
                </MDBBtn>
              </div>
            )}
          </section>
        </MDBRow>
      </MDBContainer>
    </main>
  );
}
