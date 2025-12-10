import svgPaths from "./svg-0miwyymi32";
import imgImage1 from "figma:asset/8ad47dd7bb9f4c0f280877f3e9e1661a9e1b6e84.png";

function Icon() {
  return (
    <div className="css-cd1uvh css-wc1msa" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.p3f646e80} fill="var(--fill-0, #F1F3F4)" fillRule="evenodd" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function StateLayer() {
  return (
    <div className="css-paq0kv css-sce561" data-name="state-layer">
      <Icon />
    </div>
  );
}

function Container() {
  return (
    <div className="css-2gbjjk css-g5joxp" data-name="container">
      <StateLayer />
    </div>
  );
}

function LeadingIcon() {
  return (
    <div className="css-fc0ya css-kztybc css-lyklfo" data-name="Leading-icon">
      <Container />
    </div>
  );
}

function Frame() {
  return (
    <div className="css-6lo76x css-9p0mdx css-d3o74k">
      <div aria-hidden="true" className="css-acsbaq css-ggwoeh css-s3s1qq" />
      <div className="css-5jdvtf css-lrydxx css-vkpzlc">
        <p className="css-8zr56v css-z6m7gn">Mis tareas</p>
      </div>
    </div>
  );
}

export default function MenuLateral() {
  return (
    <div className="css-j9f0op css-vf8mzy" data-name="Menu lateral">
      <div className="css-cwfngn css-rbtuvq css-t2mdnz" />
      <LeadingIcon />
      <Frame />
      <div className="css-21v9wf css-roiesn" data-name="image 1">
        <div aria-hidden="true" className="css-r0azwh css-trglf0">
          <img alt="" className="css-9unj7x css-ez8men css-trglf0" src={imgImage1} />
          <div className="css-lvf5f6 css-r0azwh css-trglf0" />
        </div>
      </div>
    </div>
  );
}