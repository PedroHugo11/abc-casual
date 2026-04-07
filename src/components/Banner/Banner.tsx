import Image from "next/image";
import banner from "../../../public/assets/banner.png";
import "./Banner.css";

export default function Banner() {
  return (
    <div className="banner-container">
      <Image src={banner} alt="banner" className="banner-img" />
    </div>
  );
}
