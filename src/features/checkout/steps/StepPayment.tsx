"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

import { selectPayment } from "@/features/checkout/checkoutSlice"

import {
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBInput
} from "mdb-react-ui-kit"

interface Props {
  next: () => void
  back: () => void
}

export default function StepPayment({ next, back }: Props) {

  const dispatch = useAppDispatch()

  const paymentMethod = useAppSelector(
    (state) => state.checkout.paymentMethod
  )

  const [card, setCard] = useState({
    number: "",
    name: "",
    month: "",
    year: "",
    cvv: ""
  })

  function confirmCard() {
    dispatch(selectPayment("credit"))
    next()
  }

  return (
    <section>

      <h4 className="mb-4">
        Escolha a forma de pagamento:
      </h4>

      {/* CARTÃO */}
      <MDBCard
        className="mb-3"
        style={{ cursor: "pointer" }}
        onClick={() => dispatch(selectPayment("credit"))}
      >
        <MDBCardBody>

          <div className="d-flex align-items-center gap-3">

            <input
              type="radio"
              checked={paymentMethod === "credit"}
              readOnly
            />

            <span>Cartão de Crédito</span>

          </div>

          {paymentMethod === "credit" && (

            <section className="mt-4">

              <MDBRow className="mb-3">

                <MDBCol md="6">
                  <MDBInput
                    label="Número do cartão"
                    value={card.number}
                    onChange={(e) =>
                      setCard({ ...card, number: e.target.value })
                    }
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                    label="Nome do titular"
                    value={card.name}
                    onChange={(e) =>
                      setCard({ ...card, name: e.target.value })
                    }
                  />
                </MDBCol>

              </MDBRow>

              <MDBRow className="mb-3">

                <MDBCol md="3">
                  <MDBInput
                    label="Mês"
                    value={card.month}
                    onChange={(e) =>
                      setCard({ ...card, month: e.target.value })
                    }
                  />
                </MDBCol>

                <MDBCol md="3">
                  <MDBInput
                    label="Ano"
                    value={card.year}
                    onChange={(e) =>
                      setCard({ ...card, year: e.target.value })
                    }
                  />
                </MDBCol>

                <MDBCol md="3">
                  <MDBInput
                    label="CVV"
                    value={card.cvv}
                    onChange={(e) =>
                      setCard({ ...card, cvv: e.target.value })
                    }
                  />
                </MDBCol>

                <MDBCol md="3" className="d-flex align-items-end">

                  <MDBBtn
                    color="primary"
                    onClick={confirmCard}
                  >
                    Confirmar
                  </MDBBtn>

                </MDBCol>

              </MDBRow>

            </section>

          )}

        </MDBCardBody>
      </MDBCard>

      {/* PIX */}
      <MDBCard
        className="mb-3"
        style={{ cursor: "pointer" }}
        onClick={() => dispatch(selectPayment("pix"))}
      >

        <MDBCardBody>
          <div className="d-flex align-items-center gap-3">
            <input
              type="radio"
              checked={paymentMethod === "pix"}
              readOnly
            />
            <span>PIX</span>
          </div>

          {paymentMethod === "pix" && (

            <section className="mt-3">
              <ol>
                <li>
                  Finalize sua compra e abra o APP do banco na opção PIX
                </li>

                <li>
                  Aponte a câmera do celular para o QR Code
                </li>

                <li>
                  Confirme o pagamento pelo aplicativo do banco
                </li>

              </ol>
            </section>

          )}

        </MDBCardBody>
      </MDBCard>

      {/* BOTÕES */}

      <div className="d-flex gap-3 mt-4">

        <MDBBtn
          outline
          color="warning"
          onClick={back}
        >
          Voltar
        </MDBBtn>

        <MDBBtn
          color="warning"
          disabled={!paymentMethod}
          onClick={next}
        >
          Continuar
        </MDBBtn>

      </div>

    </section>
  )
}