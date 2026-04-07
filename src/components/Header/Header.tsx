"use client";

import "./Header.css";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBBtn,
  MDBBadge,
} from "mdb-react-ui-kit";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { logout } from "@/features/auth/authSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/features/cart/cartSlice";
import { selectProducts } from "@/features/products/productsSlice";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const products = useAppSelector(selectProducts);
  const cartItems = useAppSelector(selectCartItems);
  const user = useAppSelector((state) => state.auth.user);

  const itemCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems],
  );

  const total = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0,
      ),
    [cartItems],
  );

  const prevCount = useRef(itemCount);

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setMiniCartOpen(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    prevCount.current = itemCount;
  }, [itemCount]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/products?search=${encodeURIComponent(search)}`);
    setShowAutocomplete(false);
  }

  const autocompleteResults = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <form
            onSubmit={handleSearch}
            className="header-search"
            style={{ position: "relative" }}
          >
            <input
              type="search"
              className="search"
              id="search"
              placeholder="O que você procura?"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowAutocomplete(true);
              }}
              onFocus={() => setShowAutocomplete(true)}
            />

            {showAutocomplete && search && (
              <div className="autocomplete-dropdown">
                {autocompleteResults.length === 0 && (
                  <div className="autocomplete-item">
                    Nenhum produto encontrado
                  </div>
                )}

                {autocompleteResults.map((product) => (
                  <div
                    key={product.id}
                    className="autocomplete-item"
                    onClick={() => {
                      router.push(`/product/${product.id}`);
                      setShowAutocomplete(false);
                    }}
                  >
                    {product.name}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className="header-center">
          <Link href="/">
            <img src="/assets/logo.png" alt="logo" className="logo" />
          </Link>
        </div>

        <div className="header-right nav-icons d-none d-md-flex">
          <MDBDropdown>
            <MDBDropdownToggle
              color="none"
              caret={false}
              className="p-0 shadow-0 border-0 bg-transparent"
            >
              <i className="fa-regular fa-user" />{" "}
              {user ? user.name.split(" ")[0] : "Entrar"}
            </MDBDropdownToggle>

            <MDBDropdownMenu>
              {/* 👤 LOGADO */}
              {user ? (
                <>
                  <MDBDropdownItem header>
                    Olá, {user.name.split(" ")[0]}!
                  </MDBDropdownItem>

                  {/* 🛠️ ADMIN */}
                  {user.role === "admin" && (
                    <>
                      <MDBDropdownItem
                        link
                        onClick={() => router.push("/admin")}
                      >
                        Dashboard
                      </MDBDropdownItem>

                      <MDBDropdownItem
                        link
                        onClick={() => router.push("/admin/products")}
                      >
                        Produtos
                      </MDBDropdownItem>

                      <MDBDropdownItem
                        link
                        onClick={() => router.push("/admin/orders")}
                      >
                        Pedidos
                      </MDBDropdownItem>
                    </>
                  )}

                  {/* 👤 CUSTOMER */}
                  {user.role === "customer" && (
                    <>
                      <MDBDropdownItem
                        link
                        onClick={() => router.push("/account/orders")}
                      >
                        Meus pedidos
                      </MDBDropdownItem>

                      <MDBDropdownItem
                        link
                        onClick={() => router.push("/account/profile")}
                      >
                        Meu perfil
                      </MDBDropdownItem>

                      <MDBDropdownItem
                        link
                        onClick={() => router.push("/account/addresses")}
                      >
                        Endereços
                      </MDBDropdownItem>
                    </>
                  )}
                  <MDBDropdownItem divider />

                  <MDBDropdownItem link onClick={() => dispatch(logout())}>
                    Sair
                  </MDBDropdownItem>
                </>
              ) : (
                <>
                  <MDBDropdownItem link onClick={() => setLoginOpen(true)}>
                    Entrar
                  </MDBDropdownItem>

                  <MDBDropdownItem link onClick={() => setRegisterOpen(true)}>
                    Criar conta
                  </MDBDropdownItem>
                </>
              )}
            </MDBDropdownMenu>
          </MDBDropdown>

          {/* LOGIN MODAL */}
          <MDBModal open={loginOpen} setOpen={setLoginOpen}>
            <MDBModalDialog centered>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle className="text-dark">Login</MDBModalTitle>
                  <MDBBtn
                    className="btn-close"
                    color="none"
                    onClick={() => setLoginOpen(false)}
                  />
                </MDBModalHeader>
                <MDBModalBody>
                  <LoginForm
                    onClose={() => setLoginOpen(false)}
                    onCreateAccount={() => {
                      setLoginOpen(false);
                      setRegisterOpen(true);
                    }}
                    onForgotPassword={() => {
                      console.log("Esqueceu senha");
                    }}
                  />
                </MDBModalBody>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>

          {/* REGISTER MODAL */}
          <MDBModal open={registerOpen} setOpen={setRegisterOpen}>
            <MDBModalDialog centered>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle className="text-dark">
                    Criar conta
                  </MDBModalTitle>
                  <MDBBtn
                    className="btn-close"
                    color="none"
                    onClick={() => setRegisterOpen(false)}
                  />
                </MDBModalHeader>
                <MDBModalBody>
                  <RegisterForm onClose={() => setRegisterOpen(false)} />
                </MDBModalBody>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>

          <i className="icon fa-regular fa-heart" />

          {/* CART */}
          <div
            className="mini-cart-wrapper"
            onMouseEnter={() => setMiniCartOpen(true)}
            onMouseLeave={() => setMiniCartOpen(false)}
          >
            <Link href="/cart" className="cart-link">
              <i className="icon fa-solid fa-cart-shopping" />

              {cartItems.length > 0 && (
                <MDBBadge color="warning" pill notification>
                  {cartItems.length}
                </MDBBadge>
              )}
            </Link>

            {miniCartOpen && cartItems.length > 0 && (
              <div className="mini-cart slide-down">
                {cartItems.map((ci, index) => (
                  <div key={index} className="mini-cart-item">
                    <img src={ci.product.image} alt={ci.product.name} />
                    <div>
                      <strong>{ci.product.name}</strong>
                      <div className="mini-price">
                        R$ {(ci.product.price * ci.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mini-cart-footer">
                  <span>Subtotal</span>
                  <strong>R$ {total.toFixed(2)}</strong>
                </div>

                <Link href="/cart" className="mini-cart-btn">
                  Finalizar Compra
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="header-categories">
        <button className="menu-toggle-btn" onClick={() => setOpen(!open)}>
          <i className="fa-solid fa-bars"></i>
        </button>

        <div className={`categories-links ${open ? "open" : ""}`}>
          <Link href="/products?category=t-shirt" className="cat-link">
            T-Shirt
          </Link>
          <Link href="/products?category=oversized" className="cat-link">
            Oversized
          </Link>
          <Link href="/products?category=regata" className="cat-link">
            Regata
          </Link>
          <Link href="/products" className="cat-link">
            Todos os produtos
          </Link>
        </div>
      </nav>
    </header>
  );
}
