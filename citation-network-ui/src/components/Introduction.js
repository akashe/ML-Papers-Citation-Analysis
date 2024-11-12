import {
  addFonts,
  cx,
  RichText,
  useLocaleInfo,
  useVariantState,
  withCSS,
} from "framer";
import { LayoutGroup, motion, MotionConfigContext } from "framer-motion";
import * as React from "react";
import { useState, useEffect } from "react";
import { useMediaQuery } from '@mui/material';
const serializationHash = "framer-LXBZY";
const variantClassNames = { nKHeW0rDT: "framer-v-nhgl9z" };


function addPropertyOverrides(overrides, ...variants) {
  const nextOverrides = {};
  variants === null || variants === void 0
    ? void 0
    : variants.forEach(
        (variant) => variant && Object.assign(nextOverrides, overrides[variant])
      );
  return nextOverrides;
}

const transition1 = { bounce: 0.2, delay: 0, duration: 0.4, type: "spring" };
const Transition = ({ value, children }) => {
  const config = React.useContext(MotionConfigContext);
  const transition = value ?? config.transition;
  const contextValue = React.useMemo(
    () => ({ ...config, transition }),
    [JSON.stringify(transition)]
  );

  return (
    <MotionConfigContext.Provider value={contextValue}>
      {children}
    </MotionConfigContext.Provider>
  );
};

const Variants = motion.div;

const getProps = ({ height, id, width, ...props }) => {
  return { ...props };
};

const createLayoutDependency = (props, variants) => {
  if (props.layoutDependency)
    return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};

const Component = /*#__PURE__*/ React.forwardRef(function (props, ref) {
  const { activeLocale, setLocale } = useLocaleInfo();
  const { style, className, layoutId, variant, ...restProps } = getProps(props);
  const {
    baseVariant,
    classNames,
    clearLoadingGesture,
    gestureHandlers,
    gestureVariant,
    isLoading,
    setGestureState,
    setVariant,
    variants,
  } = useVariantState({
    defaultVariant: "nKHeW0rDT",
    variant,
    variantClassNames,
  });
  const layoutDependency = createLayoutDependency(props, variants);
  const ref1 = React.useRef(null);
  const defaultLayoutId = React.useId();
  const sharedStyleClassNames = [];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const isMobileView = useMediaQuery('(max-width:640px), (max-height:640px)');
  const subtitles = [
    "Dive deep into citation graph of AI/ML papers",
    "See how an idea evolved over time",
    "Check for path between 2 papers",
    "Find new and interesting papers"
  ];

  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % subtitles.length);
  }, 3000);

  return () => clearInterval(timer);
}, []);

  return (
    <LayoutGroup id={layoutId ?? defaultLayoutId}>
      <Variants animate={variants} initial={false}>
        <Transition value={transition1}>
          <motion.div
            {...restProps}
            {...gestureHandlers}
            className={cx(
              serializationHash,
              ...sharedStyleClassNames,
              "framer-nhgl9z",
              className,
              classNames
            )}
            data-framer-name="Variant 1"
            layoutDependency={layoutDependency}
            layoutId="nKHeW0rDT"
            ref={ref ?? ref1}
            style={{
              ...style,
              backgroundImage: `radial-gradient(circle at center, 
                rgba(255, 255, 255, 0.9) 0%, 
                rgba(255, 255, 255, 0.85) 50%, 
                rgba(255, 255, 255, 0.6) 100%
              ), url("/graph.png")`,
              backgroundSize: { xs: 'contain', sm: '90% 90%' },
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: { xs: '100%', sm: '1200px' },
              height: { xs: '60vh', sm: '800px' },
              maxWidth: '100vw',
              maxHeight: { xs: '500px', sm: '100vh' },
              padding: { xs: '1rem', sm: '2rem' },
              overflow: 'hidden',
            }}
          >
            <motion.div
              className="framer-xf4cq4"
              data-framer-name="Content"
              layoutDependency={layoutDependency}
              layoutId="hcpQaAPEn"
              style={{
                width: { xs: '90%', sm: '774px' },
                padding: { xs: '1rem', sm: '0' },
                gap: { xs: '10px', sm: '20px' },
                // Add this to ensure content is visible in landscape
                position: 'relative',
                zIndex: 1,
              }}
            >
              <RichText
                __fromCanvasComponent
                className="framer-26g0yq"
                fonts={["FR;InterDisplay-Bold"]}
                layoutDependency={layoutDependency}
                layoutId="mWMzoHLxY"
                style={{
                  "--extracted-gdpscs": "rgb(51, 51, 51)",
                  "--framer-link-text-color": "rgb(0, 153, 255)",
                  "--framer-link-text-decoration": "underline",
                  "--framer-paragraph-spacing": "0px",
                  display: 'block !important',
                  visibility: 'visible !important',
                }}
                verticalAlignment="top"
                withExternalLayout
              >
                <motion.h1
                  style={{
                    "--font-selector": "RlI7SW50ZXJEaXNwbGF5LUJvbGQ=",
                    "--framer-font-family": '"Inter Display", "Inter Display Placeholder", sans-serif',
                    "--framer-font-size": isMobileView ? "min(6vw, 48px)" : "min(7vw, 64px)", // Adjusted for better visibility
                    "--framer-font-weight": "400",
                    "--framer-letter-spacing": "-2px",
                    "--framer-text-alignment": "center",
                    "--framer-text-color": "var(--extracted-gdpscs, rgb(51, 51, 51))",
                  }}
                >
                  Discover Research Visually
                </motion.h1>
              </RichText>
              <RichText
                __fromCanvasComponent
                className="framer-1h0tzx2"
                fonts={["GF;Inter-500"]}
                layoutDependency={layoutDependency}
                layoutId="dRfrPDaXb"
                style={{
                  "--extracted-14qxiz": "rgb(130, 118, 118)",
                  "--extracted-1ifjl81": "rgb(130, 118, 118)",
                  "--extracted-1of0zx5": "rgb(130, 118, 118)",
                  "--extracted-hi0pf5": "rgb(130, 118, 118)",
                  "--framer-paragraph-spacing": "0px",
                }}
                verticalAlignment="top"
                withExternalLayout
              >
                {isMobileView ? (
                  <motion.div
                    style={{
                      minHeight: '48px', // Reduced height for landscape
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <motion.h2
                      key={currentSlideIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        "--font-selector": "R0Y7SW50ZXItNTAw",
                        "--framer-font-family": '"Inter", "Inter Placeholder", sans-serif',
                        "--framer-font-size": "min(4vw, 24px)", // Adjusted for better visibility
                        "--framer-font-weight": "500",
                        "--framer-letter-spacing": "-0.5px",
                        "--framer-line-height": "1.2em",
                        "--framer-text-alignment": "center",
                        "--framer-text-color": "var(--extracted-1of0zx5, rgb(130, 118, 118))",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        maxWidth: "100%"
                      }}
                    >
                      {subtitles[currentSlideIndex]}
                    </motion.h2>
                  </motion.div>
                ) : (
                  <motion.div>
                    {subtitles.map((subtitle, index) => (
                      <motion.h2
                        key={index}
                        style={{
                          "--font-selector": "R0Y7SW50ZXItNTAw",
                          "--framer-font-family": '"Inter", "Inter Placeholder", sans-serif',
                          "--framer-font-size": "min(4vw, 32px)",
                          "--framer-font-weight": "500",
                          "--framer-letter-spacing": "-0.5px",
                          "--framer-line-height": "1.5em",
                          "--framer-text-alignment": "center",
                          "--framer-text-color": "var(--extracted-1of0zx5, rgb(130, 118, 118))",
                        }}
                      >
                        {subtitle}
                      </motion.h2>
                    ))}
                  </motion.div>
                )}
              </RichText>
            </motion.div>
          </motion.div>
        </Transition>
      </Variants>
    </LayoutGroup>
  );
});

const css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-LXBZY.framer-1nyiqch, .framer-LXBZY .framer-1nyiqch { display: block; }",
    ".framer-LXBZY.framer-nhgl9z { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 800px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-LXBZY .framer-xf4cq4 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; max-width: 2018px; padding: 0px; position: relative; width: 774px; }",
    ".framer-LXBZY .framer-26g0yq, .framer-LXBZY .framer-1h0tzx2 { flex: none; height: auto; overflow: visible; position: relative; white-space: pre-wrap; width: 100%; word-break: break-word; word-wrap: break-word; }",
    "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-LXBZY.framer-nhgl9z, .framer-LXBZY .framer-xf4cq4 { gap: 0px; } .framer-LXBZY.framer-nhgl9z > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-LXBZY.framer-nhgl9z > :first-child { margin-left: 0px; } .framer-LXBZY.framer-nhgl9z > :last-child { margin-right: 0px; } .framer-LXBZY .framer-xf4cq4 > * { margin: 0px; margin-bottom: calc(20px / 2); margin-top: calc(20px / 2); } .framer-LXBZY .framer-xf4cq4 > :first-child { margin-top: 0px; } .framer-LXBZY .framer-xf4cq4 > :last-child { margin-bottom: 0px; } }",
  ];
  /**
   * This is a generated Framer component.
   * @framerIntrinsicHeight 636
   * @framerIntrinsicWidth 920
   * @framerCanvasComponentVariantDetails {"propertyName":"variant","data":{"default":{"layout":["fixed","fixed"]}}}
   * @framerImmutableVariables true
   * @framerDisplayContentsDiv false
   * @framerComponentViewportWidth true
   */ const FramerfXrDELPdw = withCSS(Component, css, "framer-LXBZY");
  export default FramerfXrDELPdw;
  FramerfXrDELPdw.displayName = "explainer component";
  FramerfXrDELPdw.defaultProps = { height: 800, width: 1200 };
  addFonts(
    FramerfXrDELPdw,
    [
      {
        explicitInter: true,
        fonts: [
          {
            family: "Inter Display",
            source: "framer",
            style: "normal",
            unicodeRange:
              "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F",
            url: "https://framerusercontent.com/assets/I11LrmuBDQZweplJ62KkVsklU5Y.woff2",
            weight: "700",
          },
          {
            family: "Inter Display",
            source: "framer",
            style: "normal",
            unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
            url: "https://framerusercontent.com/assets/UjFZPDy3qGuDktQM4q9CxhKfIa8.woff2",
            weight: "700",
          },
          {
            family: "Inter Display",
            source: "framer",
            style: "normal",
            unicodeRange: "U+1F00-1FFF",
            url: "https://framerusercontent.com/assets/8exwVHJy2DhJ4N5prYlVMrEKmQ.woff2",
            weight: "700",
          },
          {
            family: "Inter Display",
            source: "framer",
            style: "normal",
            unicodeRange: "U+0370-03FF",
            url: "https://framerusercontent.com/assets/UTeedEK21hO5jDxEUldzdScUqpg.woff2",
            weight: "700",
          },
          {
            family: "Inter Display",
            source: "framer",
            style: "normal",
            unicodeRange:
              "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF",
            url: "https://framerusercontent.com/assets/Ig8B8nzy11hzIWEIYnkg91sofjo.woff2",
            weight: "700",
          },
          {
            family: "Inter Display",
            source: "framer",
            style: "normal",
            unicodeRange:
              "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
            url: "https://framerusercontent.com/assets/n9CXKI3tsmCPeC6MCT9NziShSuQ.woff2",
            weight: "700",
          },
          {
            family: "Inter Display",
            source: "framer",
            style: "normal",
            unicodeRange:
              "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB",
            url: "https://framerusercontent.com/assets/qctQFoJqJ9aIbRSIp0AhCQpFxn8.woff2",
            weight: "700",
          },
          {
            family: "Inter",
            source: "google",
            style: "normal",
            url: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZ1rib2Bg-4.woff2",
            weight: "500",
          },
        ],
      },
    ],
    { supportsExplicitInterCodegen: true }
  );
export const __FramerMetadata__ = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "FramerfXrDELPdw",
      slots: [],
      annotations: {
        framerImmutableVariables: "true",
        framerIntrinsicHeight: "636",
        framerDisplayContentsDiv: "false",
        framerIntrinsicWidth: "920",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","fixed"]}}}',
        framerComponentViewportWidth: "true",
        framerContractVersion: "1",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./fXrDELPdw.map
