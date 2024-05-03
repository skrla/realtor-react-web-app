import Spinner from "./Spinner";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { useNavigate } from "react-router-dom";
import { fetchListingsSpinner } from "../backend/listings";
import { ListingType } from "../types/listingTypes";

export default function Slider() {
  const [listings, setListings] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchListings() {
    const listingData = await fetchListingsSpinner();
    setListings(listingData);
    setLoading(false);
  }

  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (!listings || listings.length === 0) {
    return <></>;
  }
  return (
    <>
      <Swiper
        modules={[EffectFade, Pagination, Autoplay, Navigation]}
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 3000 }}
      >
        {listings.map((listing) => (
          <SwiperSlide
            key={listing.id}
            onClick={() => navigate(`category/${listing.type}/${listing.id}`)}
          >
            <div
              style={{
                background: `url(${listing.imgUrls[0]}), center, no-repeat`,
                backgroundSize: "cover",
              }}
              className="w-full
                    h-[300px] overflow-hidden relative"
            ></div>
            <p
              className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%]
                    bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl"
            >
              {listing.title}
            </p>
            <p
              className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%]
                    bg-[#e64946] shadow-lg opacity-90 p-2 rounded-tr-3xl"
            >
              ${listing.discountedPrice ?? listing.regularPrice}
              {listing.type === "rent" && " / month"}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
