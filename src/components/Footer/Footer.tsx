"use client";

import "./Footer.css";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* NEWSLETTER */}

      <section className="footer-quote text-center">
        <MDBContainer>
          <MDBRow className="d-flex justify-content-center align-items-center">
            <img
              src="/assets/logo.png"
              alt="ABC FC Store"
              className="footer-logo"
            />
            <h1 className="mt-4">Futebol também é se vestir bem</h1>
            <p className="w-75 mt-4 mb-0">
              Mais que roupas, essa linha casual representa o sentimento de quem
              carrega o ABC com orgulho. Uma expressão da cultura do futebol,
              das memórias da torcida e da identidade que acompanha você dentro
              e fora dos dias de jogo.
            </p>
          </MDBRow>
        </MDBContainer>
      </section>

      <hr className="footer-divider" />

      {/* CONTEÚDO PRINCIPAL */}

      <section className="footer-content">
        <MDBContainer>
          <MDBRow className="d-flex justify-content-start justify-content-md-around align-items-start">
            {/* INSTITUCIONAL */}

            <div className="w-max-content d-flex">
              <nav aria-labelledby="footer-institucional">
                <h6 id="footer-institucional" className="fw-bold">
                  INSTITUCIONAL
                </h6>

                <ul className="footer-links">
                  <li>
                    <a href="#">Política de Privacidade</a>
                  </li>
                  <li>
                    <a href="#">Termos de uso</a>
                  </li>
                  <li>
                    <a href="#">Trocas e devoluções</a>
                  </li>
                  <li>
                    <a href="#">Sobre Nós</a>
                  </li>
                  <li>
                    <a href="#">Fale Conosco</a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* ATENDIMENTO */}

            <div className="w-max-content d-flex">
              <address className="footer-contact">
                <h6 className="fw-bold">ATENDIMENTO</h6>

                <p>
                  <i className="fa-solid fa-phone me-2"></i>
                  (00) 0000-0000
                </p>

                <p>
                  <i className="fa-solid fa-envelope me-2"></i>
                  contato@abcfcstore.com.br
                </p>
              </address>
            </div>

            {/* PAGAMENTOS */}

            <div className="w-max-content d-flex">
              <section>
                <h6 className="fw-bold">FORMAS DE PAGAMENTO</h6>

                <div className="payment-icons">
                  <img src="/assets/visa.webp" alt="Visa" />
                  <img src="/assets/mastercard.webp" alt="Mastercard" />
                  <img src="/assets/pix.webp" alt="Pix" />
                </div>
              </section>
            </div>
          </MDBRow>
        </MDBContainer>
      </section>

      {/* RODAPÉ FINAL */}

      <section className="footer-bottom text-center">
        <MDBContainer>
          <p className="mb-1">Loja ABC Casual</p>

          <p className="mb-0">
            Feito por <strong>PHSoftware</strong>
          </p>
        </MDBContainer>
      </section>
    </footer>
  );
}
