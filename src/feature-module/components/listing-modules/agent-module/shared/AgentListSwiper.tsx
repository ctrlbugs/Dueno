import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import type { AgentUser } from "../../../../../types/user";
import AgentGridCard from "./AgentGridCard";
import "../../../../../../node_modules/swiper/swiper.css";
import "../../../../../../node_modules/swiper/modules/pagination.css";

/** Bootstrap md — iPad portrait and up (2 cards per slide). */
export const AGENT_LIST_TABLET_BREAKPOINT = 768;

const agentListBreakpoints = {
  [AGENT_LIST_TABLET_BREAKPOINT]: {
    slidesPerView: 2,
    slidesPerGroup: 1,
    spaceBetween: 20,
  },
} as const;

type Props = {
  agents: AgentUser[];
};

const bindCarouselNavigation = (
  swiper: SwiperInstance,
  prevEl: HTMLButtonElement | null,
  nextEl: HTMLButtonElement | null,
) => {
  if (!prevEl || !nextEl) return;

  const navigation = swiper.params.navigation;
  if (!navigation || typeof navigation !== "object") return;

  navigation.prevEl = prevEl;
  navigation.nextEl = nextEl;
  swiper.navigation.destroy();
  swiper.navigation.init();
  swiper.navigation.update();
};

const AgentListSwiper = ({ agents }: Props) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const showNav = agents.length > 1;

  if (agents.length === 0) return null;

  return (
    <div className="agent-list-swiper-wrap">
      {showNav ? (
        <div className="agent-list-swiper-toolbar">
          <button
            type="button"
            ref={prevRef}
            className="agent-list-swiper-btn agent-list-swiper-prev"
            aria-label="Previous agent"
          >
            <i className="material-icons-outlined">chevron_left</i>
          </button>
          <button
            type="button"
            ref={nextRef}
            className="agent-list-swiper-btn agent-list-swiper-next"
            aria-label="Next agent"
          >
            <i className="material-icons-outlined">chevron_right</i>
          </button>
        </div>
      ) : null}

      <Swiper
        key={agents.map((agent) => agent.id).join("-")}
        className="agent-list-swiper"
        modules={[Keyboard, Navigation, Pagination]}
        onBeforeInit={(swiper) => {
          if (!showNav) return;
          const navigation = swiper.params.navigation;
          if (!navigation || typeof navigation !== "object") return;
          navigation.prevEl = prevRef.current;
          navigation.nextEl = nextRef.current;
        }}
        onSwiper={(swiper) => {
          if (showNav) {
            bindCarouselNavigation(swiper, prevRef.current, nextRef.current);
          }
        }}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={16}
        speed={400}
        keyboard={{ enabled: true }}
        pagination={{
          clickable: true,
          dynamicBullets: agents.length > 4,
        }}
        navigation={
          showNav
            ? {
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }
            : false
        }
        watchOverflow
        breakpoints={agentListBreakpoints}
      >
        {agents.map((agent) => (
          <SwiperSlide key={agent.id}>
            <div className="agent-list-swiper__slide">
              <AgentGridCard agent={agent} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AgentListSwiper;
