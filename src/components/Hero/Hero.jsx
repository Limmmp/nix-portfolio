// В Hero.jsx добавь проп onOpenContact и кнопку
<div className="hero__cta">
  <a 
    href="#links" 
    className="hero__btn hero__btn--primary interactive"
    onClick={(e) => handleSmoothScroll(e, '#links')}
  >
    VIEW STATS
  </a>
  <button 
    className="hero__btn hero__btn--secondary interactive"
    onClick={() => onOpenContact()}
  >
    PARTNERSHIP
  </button>
</div>